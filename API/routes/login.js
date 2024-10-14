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

      let phonenumber = body.phonenumber;
      let password = body.password;

      validation.checkNull(phonenumber);
      validation.checkNull(password);

      validation.checkString(phonenumber, "Phone number");
      validation.validatePassword(password);

      let status = await userData.loginUser(phonenumber, password);

      if (status == "Database error.")
        return res.status(500).json({ error: "Internal server error" });
      else {
        res.cookie("AuthState", "Logged in!");
        req.session.user = status;
        return res.status(200).redirect("users");
      }
    } catch (error) {
      return res
        .status(400)
        .json({error: error});
    }
  });

export default router;
