import { Router } from "express";
const router = Router();
import { userData, mealData } from "../data/index.js";
import validation from "../validation.js";

router
.route("/create")
.get(async (req, res) => {
    return res.status(400).redirect("/");
})
.post(async (req, res) => {
    if (!req.session.user)
        return res.status(200);

    let data = req.body;
    data = validation.sanitize(data);
    try {
        let name = data.name;
        let description = data.description;
        let creatorId = req.session.user._id.toString();
        let date = data.date;

        //* Validate Null
        validation.checkNull(name);
        validation.checkNull(description);
        validation.checkId(creatorId);
        validation.checkNull(date);

        //* Validate String
        name = validation.checkString(name);
        description = validation.checkString(description);
        creatorId = validation.checkId(creatorId);
        date = validation.checkString(date);

        if (name.length < 2 || name.length > 50)
            throw "Error: Meal Name is too short or too long";
        if (description.length < 15 || description.length > 250)
            throw "Error: Description is too short or too long";
        creatorId = validation.checkId(creatorId, "Creator ID");
        date = validation.checkString(date, "Date Due");

        //Date validation
        validation.validateDate(date);

        const create = await mealData.create(
            name,
            description,
            creatorId,
            date,
        );

        return res.status(200).redirect("/meals/all");
    }

    catch (error) {
        return res
        .status(400)
        .json({error: error});
    }
});

router.route("/all").get(async (req, res) => {
    if (!req.session.user) return res.status(400).redirect("/");

    return res.status(200).json({
        mealList: await userData.getMeals(req.session.user._id),
    });
});

export default router;
