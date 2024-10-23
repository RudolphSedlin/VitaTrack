import { Router } from "express";
const router = Router();
import { userData, mealData } from "../data/index.js";
import validation from "../validation.js";

router
.route("/")

.get(async (req, res) => {
    if (!req.session.user) return res.status(400).send("Not authenticated!");

    return res.status(200).json({
        mealList: await userData.getMeals(req.session.user._id),
    });
})

.post(async (req, res) => {
    if (!req.session.user)
        return res.status(400).send("Not authenticated!");

    let data = req.body;
    data = validation.sanitize(data);
    try {
        let name = data.name;
        let description = data.description;
        let creatorId = req.session.user._id.toString();

        //* Validate Null
        validation.checkNull(name);
        validation.checkNull(description);
        validation.checkId(creatorId);

        //* Validate String
        name = validation.checkString(name);
        description = validation.checkString(description);
        creatorId = validation.checkId(creatorId);

        if (name.length < 2 || name.length > 50)
            throw "Error: Meal Name is too short or too long";
        if (description.length < 15 || description.length > 250)
            throw "Error: Description is too short or too long";
        creatorId = validation.checkId(creatorId, "Creator ID");

        const create = await mealData.create(
            name,
            description,
            creatorId,
        );

        req.session.user = await userData.getUserByID(req.session.user._id);

        return res.status(200).json(create);
    }

    catch (error) {
        return res
        .status(400)
        .send(error);
    }
});

router
.route("/:id")
.get(async (req, res) => {
    if (req.session.user) {
        try {
            let id = validation.checkString(req.params.id, "Id");
            let meal = await mealData.getMealByID(id);
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
