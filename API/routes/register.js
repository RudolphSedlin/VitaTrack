import { Router } from "express";
const router = Router();
import { userData } from "../data/index.js";
import validation from "../validation.js";

router
  .route("/")
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
      let height = data.height;
      let weight = data.weight;

      // Error Checking
      //* Null validations
      validation.checkNull(firstName);
      validation.checkNull(lastName);
      validation.checkNull(phoneNumber)
      validation.checkNull(state);
      validation.checkNull(password);
      validation.checkNull(confirmPassword);

      // *Validate String params
      firstName = validation.checkString(firstName, "First name");
      lastName = validation.checkString(lastName, "Last name");
      phoneNumber = validation.checkString(phoneNumber, "Phone number");
      state = validation.checkString(state, "State");
      password = validation.checkString(password, "Password");
      confirmPassword = validation.checkString(confirmPassword, "Password Confirmation");

      //* name length check
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

      if (height)
        validation.validateHeight(height, "Height");

      if (weight)
        validation.validateWeight(weight, "Weight");

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

        email,
        height,
        weight
      );

      if (status == "Database error.")
        return res.status(500).send("Internal server error" );
      else {
        req.session.user = status;
        return res.status(200).json(status);
    }
    }
    catch (error) {
      return res
        .status(400)
        .send(error);
    }
  });

export default router;
