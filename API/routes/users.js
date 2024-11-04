import { Router } from "express";
import { userData } from "../data/index.js";
import validation from "../validation.js";
const router = Router();

router
.route("/")
.get(async (req, res) => {
  if (req.session.user)
    return res.status(200).json(req.session.user);

  return res.status(403).send("Not authenticated!");
  
})
.delete(async (req, res) => {
  try {
    if (req.session.user) {
      const anHourAgo = new Date();
      anHourAgo.setHours(anHourAgo.getHours() - 1);
      res.cookie("AuthState", "", { expires: anHourAgo }).clearCookie("AuthState");
      userData.remove(req.session.user._id);
      req.session.user = undefined;
      return res.status(200).send("User deleted!");
    }

    return res.status(403).send("Not authenticated!");
  }
  catch (error) {
    return res.status(500).send(error);
  }
})
.put(async (req, res) => {
  try {
    if (req.session.user) {
      let user = req.body;
      user = validation.sanitize(user);
      user["_id"] = req.session.user._id;

      //* Name length check
      if (user.firstName && (user.firstName.length < 2 || user.firstName.length > 25))
        throw "Error: First name is too short or too long";
      if (user.lastName && (user.lastName.length < 2 || user.lastName.length > 25))
        throw "Error: Last name is too short or too long";

      if (user.hashedPass)
        throw `Cannot update password hash.`;

      if (user.meals)
        throw `User cannot change meals in this way.`;

      if (user.address)
        user.address = validation.checkString(user.address, "Address");

      if (user.gender)
        user.gender = validation.checkString(user.gender, "Gender");

      if (user.dateOfBirth) {
        user.dateOfBirth = validation.checkString(user.dateOfBirth, "Date of Birth");
        validation.validateDate(user.dateOfBirth);
        validation.validateBirthday(user.dateOfBirth);
      }

      if (user.doctorName)
        user.doctorName = validation.checkString(user.doctorName, "Name of doctor");

      /*
      if (user.conditions)
        validation.checkStringArray(user.conditions, "Conditions");
      */

      if (user.consentLetter)
        user.consentLetter = validation.checkString(user.consentLetter, "Letter of consent");

      if (user.email) {
        user.email = validation.checkString(user.email, "Email");
        validation.validateEmail(user.email);
      }

      if (user.height)
        validation.validateHeight(user.height, "Height");

      if (user.weight)
        validation.validateWeight(user.weight, "Weight");

      if (user.allergies)
        validation.checkStringArray(user.allergies, "Allergies");

      if (user.intolerances)
        validation.checkStringArray(user.intolerances, "Intolerances");

      let update = await userData.update(user);

      req.session.user = await userData.getByID(req.session.user._id);
      return res.status(200).json(update);
    }

    return res.status(403).send("Not authenticated!");
  }
  catch (error) {
    return res.status(403).send(error);
  }
})
;

export default router;
