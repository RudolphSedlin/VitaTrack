import { Router } from "express";
const router = Router();

router.route("/").get(async (req, res) => {
  //Todo
  if (req.session && req.session.user){
    /*
    return res.status(200).render("users", {
      title: `Home Page`,
      firstName: req.session.user.firstName,
      lastName: req.session.user.lastName,
      userName: req.session.user.userName,
      email: req.session.user.email,
      dateOfBirth: req.session.user.dateOfBirth,
    });
*/
    return res.status(200).json({
      firstName: req.session.user.firstName,
      lastName: req.session.user.lastName,
      phoneNumber: req.session.user.phoneNumber,
      state: req.session.user.state,
      meals: req.session.user.meals,

      address: req.session.user.address,
      gender: req.session.user.gender,
      dateOfBirth: req.session.user.dateOfBirth,
      doctorName: req.session.user.doctorName,
      conditions: req.session.user.conditions,
      consentLetter: req.session.user.consentLetter,

      email: req.session.user.email,
    })
    }

    else{
      return res.status(400).redirect("/");
    }
  
});

export default router;
