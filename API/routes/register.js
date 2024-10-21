import { Router } from "express";
const router = Router();
import { userData } from "../data/index.js";
import validation from "../validation.js";

router
  .route("/")
  .get(async (req, res) => {
    //code here for GET
    //return res.status(200).render("register", { title: "Registration Page" });
    return res.status(200);
  })
  .post(async (req, res) => {
    //code here for POST
    let data = req.body;
    data = validation.sanitize(data);
    try {
      let firstname = data.firstname;
      let lastname = data.lastname;
      let phonenumber = data.phonenumber;
      let state = data.state;
      let password = data.password;
      let confirmPassword = data.confirmPassword;

      let address = data.address;
      let gender = data.gender;
      let dateOfBirth = data.dateOfBirth;
      let doctorname = data.doctorname;
      let conditions = data.conditions;
      let consentLetter = data.consentLetter;

      let email = data.email;
      let height = data.height;
      let weight = data.weight;

      // Error Checking
      //* Null validations
      validation.checkNull(firstname);
      validation.checkNull(lastname);
      validation.checkNull(phonenumber)
      validation.checkNull(state);
      validation.checkNull(password);
      validation.checkNull(confirmPassword);

      // *Validate String params
      firstname = validation.checkString(firstname, "First name");
      lastname = validation.checkString(lastname, "Last name");
      phonenumber = validation.checkString(phonenumber, "Phone number");
      state = validation.checkString(state, "State");
      password = validation.checkString(password, "Password");
      confirmPassword = validation.checkString(confirmPassword, "Password Confirmation");

      //* name length check
      if (firstname.length < 2 || firstname.length > 25)
        throw "Error: First name is too short or too long";
      if (lastname.length < 2 || firstname.length > 25)
        throw "Error: Last name is too short or too long";

      validation.validatePassword(password);
      validation.validatePassword(confirmPassword);

      if (password !== confirmPassword) throw "Passwords do not match.";

      if (address)
        address = validation.checkString(address, "Address");

      if (gender)
        gender = validation.checkString(gender, "Gender");

      if (dateOfBirth) {
        dateOfBirth = validation.checkString(dateOfBirth, "Date of Birth");
        validation.validateDate(dateOfBirth);
        validation.validateBirthday(dateOfBirth);
      }

      if (doctorname)
        doctorname = validation.checkString(doctorname, "name of doctor");

      if (conditions)
        conditions = validation.checkStringArray(conditions, "Conditions");

      if (consentLetter)
        consentLetter = validation.checkString(consentLetter, "Letter of consent");

      if (email) {
        email = validation.checkString(email, "Email");
        validation.validateEmail(email);
      }

      if (height)
        validation.validateHeight(height, "Height");

      if (weight)
        validation.validateWeight(weight, "Weight");

      let status = await userData.create(
        firstname,
        lastname,
        phonenumber,
        state,
        password,

        address,
        gender,
        dateOfBirth,
        doctorname,
        conditions,
        consentLetter,

        email,
        height,
        weight
      );

      if (status == "Database error.")
        return res.status(500).json({ error: "Internal server error" });
      else {
        res.cookie("AuthState", "Logged in!");
        req.session.user = status;
        return res.status(200).redirect("users");
    }
    }
    catch (error) {
      return res
        .status(400)
        .json({error: error});
    }
  });

export default router;
