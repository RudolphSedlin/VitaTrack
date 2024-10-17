import { Router } from "express";
const router = Router();

router.route("/").get(async (req, res) => {
  if (req.session.user){

    return res.status(200).json({
      firstname: req.session.user.firstname,
      lastname: req.session.user.lastname,
      phonenumber: req.session.user.phonenumber,
      state: req.session.user.state,
      meals: req.session.user.meals,

      address: req.session.user.address,
      gender: req.session.user.gender,
      dateOfBirth: req.session.user.dateOfBirth,
      doctorname: req.session.user.doctorname,
      conditions: req.session.user.conditions,
      consentLetter: req.session.user.consentLetter,

      email: req.session.user.email,
      height: req.session.user.height,
      weight: req.session.user.weight,
    })
    }

    else{
      return res.status(400).json({error: "Not authenticated."});
    }
  
});

export default router;
