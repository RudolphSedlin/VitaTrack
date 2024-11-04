import { Router } from "express";
const router = Router();
import { userData } from "../data/index.js";
import validation from "../validation.js";

router
  .route("/")
  .post(async (req, res) => {
    try {
      let body = req.body;
      body = validation.sanitize(body);

      let phoneNumber = body.phoneNumber;
      let password = body.password;

      validation.checkNull(phoneNumber);
      validation.checkNull(password);

      validation.checkString(phoneNumber, "Phone number");
      validation.validatePassword(password);

      let status = await userData.login(phoneNumber, password);

      if (status == "Database error.")
        return res.status(500).send("Internal Server Error!");
      else {
        req.session.user = status;
        return res.status(200).json(status);
      }
    } catch (error) {
      return res
        .status(400)
        .send(error);
    }
  });

export default router;
