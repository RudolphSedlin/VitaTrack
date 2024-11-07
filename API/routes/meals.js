import { Router } from "express";
const router = Router();
import { userData, mealData } from "../data/index.js";
import * as PROMPTS from "../resources/PROMPTS.js";
import * as CONSTANTS from "../resources/CONSTANTS.js";
import { BREAD } from "../resources/IMAGES.js";
import validation from "../validation.js";

router
.route("/")

.get(async (req, res) => {
    if (!req.session.user) return res.status(403).send("Not authenticated!");

    return res.status(200).json({
        mealList: await userData.getMeals(req.session.user._id),
    });
})

.post(async (req, res) => {
    if (!req.session.user)
        return res.status(403).send("Not authenticated!");

    let data = req.body;
    data = validation.sanitize(data);
    try {
        let name = data.name;
        let description = data.description;
        let creatorId = req.session.user._id.toString();
        let servings = data.servings;
        let caloriesPerServing = data.caloriesPerServing;
        let nutrientsPerServing = JSON.parse(data.nutrientsPerServing); // Should be an object!

        //* Validate Null
        validation.checkNull(name);
        validation.checkNull(description);
        validation.checkId(creatorId);

        //* Validate Specifics
        name = validation.checkString(name);
        description = validation.checkString(description);
        creatorId = validation.checkId(creatorId);

        if (name.length < 2 || name.length > 50)
            throw "Error: Meal Name is too short or too long";
        if (description.length < 5 || description.length > 1000)
            throw "Error: Description is too short or too long";
        creatorId = validation.checkId(creatorId, "Creator ID");

        if (servings)
            validation.validateServings(servings);

        if (caloriesPerServing)
            validation.validateCalories(caloriesPerServing);

        const create = await mealData.create(
            name,
            description,
            creatorId,
            servings,
            caloriesPerServing,
            nutrientsPerServing
        );

        req.session.user = await userData.getByID(req.session.user._id);

        return res.status(200).json(create);
    }

    catch (error) {
        return res
        .status(400)
        .send(error);
    }
});

router
.route("/today")
.get(async (req, res) => {
    if (!req.session.user) return res.status(403).send("Not authenticated!");

    return res.status(200).json({
        mealList: await userData.getMealsToday(req.session.user._id),
    });
});

router
.route("/image")
.post(async (req, res) => {
    if (req.session.user) {

        let body = req.body;
        body = validation.sanitize(body);

        let image = body.image;

        //Send request with prompt to api
        const requestBody = {
            model: CONSTANTS.MODEL,
            messages: [
                { role: "system", content: "You are a nutritionist." },
                { role: "user", content: [
                    {type: "text", text:PROMPTS.NUTRIENT_PROMPT},
      {type: "image_url","image_url": {"url": `data:image/jpeg;base64,${image}`
      }}
                ]}
            ],
            max_tokens: CONSTANTS.MAX_TOKENS,
            temperature: CONSTANTS.TEMPERATURE
        };

        //Retrieve response from gpt
        const result = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${CONSTANTS.OPENAI_API_KEY}`
            },
            body: JSON.stringify(requestBody)
        });

        const json = await result.json();
        let gptResponse = json.choices?.[0]?.message?.content?.trim() || 'No response.';
        gptResponse = gptResponse.replaceAll("```", "");
        gptResponse = gptResponse.replace("json", "");
        gptResponse = JSON.parse(gptResponse);

        let name = gptResponse.name;
        let description = gptResponse.description;
        let creatorId = req.session.user._id.toString();
        let servings = gptResponse.servings;
        let caloriesPerServing = gptResponse.caloriesPerServing;
        let nutrientsPerServing = gptResponse.nutrientsPerServing;

        const create = await mealData.create(
            name,
            description,
            creatorId,
            servings,
            caloriesPerServing,
            nutrientsPerServing
        );

        req.session.user = await userData.getByID(req.session.user._id);

        return res.status(200).json(create);
    }

    return res.status(403).send("Not authenticated!");
})
;

router
.route("/:id")
.get(async (req, res) => {
    if (req.session.user) {
        try {
            let id = validation.checkString(req.params.id, "Id");
            let meal = await mealData.getByID(id);
            if (meal.creatorId != req.session.user._id)
                return res.status(403).send("This meal doesn't belong to this user.");
            return res.status(200).json(meal);
        } catch (error) {
            return res
            .status(404)
            .send(error);
        }
    }

    return res.status(403).send("Not authenticated!");
});

export default router;
