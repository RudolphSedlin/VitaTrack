import { Router } from "express";
const router = Router();
import { userData } from "../data/index.js";
import validation from "../validation.js";

router
  .route("/")
  .get(async (req, res) => {
    //code here for GET
    //return res.status(200).render("login", { title: "Login Page" });
    return res.status(200);
  })
  .post(async (req, res) => {
    //code here for POST
    try {
      let body = req.body;
      body = validation.sanitize(body);

      let phoneNumber = body.phoneNumber;
      let password = body.password;

      validation.checkNull(phoneNumber);
      validation.checkNull(password);

      validation.checkString(phoneNumber, "Phone Number");
      validation.validatePassword(password);


      let status = await userData.loginUser(phoneNumber, password);

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
