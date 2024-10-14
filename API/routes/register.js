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
      let firstName = data.firstName;
      let lastName = data.lastName;
      let phoneNumber = data.phoneNumber;
      let state = data.state;
      let password = data.password;
      let confirmPassword = data.confirmPassword;

      let address = data.address;
      let gender = data.gender;
      let dateOfBirth = data.dateOfBirth;
      let doctorName = data.doctorName;
      let conditions = data.conditions;
      let consentLetter = data.consentLetter;

      let email = data.email;

      // Error Checking
      //* Null validations
      validation.checkNull(firstName);
      validation.checkNull(lastName);
      validation.checkNull(phoneNumber)
      validation.checkNull(state);
      validation.checkNull(password);
      validation.checkNull(confirmPassword);

      // *Validate String params
      firstName = validation.checkString(firstName, "First Name");
      lastName = validation.checkString(lastName, "Last Name");
      phoneNumber = validation.checkString(phoneNumber, "Phone Number");
      dateOfBirth = validation.checkString(dateOfBirth, "Date of Birth");
      password = validation.checkString(password, "Password");
      confirmPassword = validation.checkString(confirmPassword, "Password Confirmation");

      //* Name length check
      if (firstName.length < 2 || firstName.length > 25)
        throw "Error: First name is too short or too long";
      if (lastName.length < 2 || firstName.length > 25)
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

      if (doctorName)
        doctorName = validation.checkString(doctorName, "Name of doctor");

      if (conditions)
        conditions = validation.checkStringArray(conditions, "Conditions");

      if (consentLetter)
        consentLetter = validation.checkString(consentLetter, "Letter of consent");

      if (email) {
        email = validation.checkString(email, "Email");
        validation.validateEmail(email);
      }

      let status = await userData.create(
        firstName,
        lastName,
        phoneNumber,
        state,
        password,

        address,
        gender,
        dateOfBirth,
        doctorName,
        conditions,
        consentLetter,

        email
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
