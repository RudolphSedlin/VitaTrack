import validation from "../validation.js";
import { ObjectId } from "mongodb";
import { meals, users } from "../config/mongoCollections.js";
import bcrypt from "bcrypt";

// Function for creating a user in the user data base
const create = async (
  firstname,
  lastname,
  phonenumber,
  state,
  password, // MANDATORY NO MATTER WHAT

  address,
  gender,
  height,
  weight,
  dateOfBirth,
  doctorName,
  conditions,
  consentLetter, // Also stored for RPM customers.

  email, // Completely optional.
) => {

  //Validation Handling For Mandatory---------------------------------------------------------------------------------
  //* Validate Null
  validation.checkNull(firstname);
  validation.checkNull(lastname);
  validation.checkNull(phonenumber);
  validation.checkNull(state);
  validation.checkNull(password);

  // * Validate String params
  firstname = validation.checkString(firstname, "First Name");
  lastname = validation.checkString(lastname, "Last Name");
  phonenumber = validation.checkString(phonenumber, "Phone number");
  state = validation.checkString(state, "State");
  password = validation.checkString(password, "Password");


  //* Name length check
  if (firstname.length < 2 || firstname.length > 25)
    throw "Error: First name is too short or too long";
  if (lastname.length < 2 || lastname.length > 25)
    throw "Error: Last name is too short or too long";

  validation.validatePassword(password);

  const saltRounds = 16;
  const hash = await bcrypt.hash(password, saltRounds);

  //Validation Handling For RPM/Optional----------------------------------------------------------------------------------------
  if (address)
    address = validation.checkString(address, "Address");

  if (gender)
    gender = validation.checkString(gender, "Gender");

  if (weight)
    weight = validation.validateWeight(weight, "Weight");

  if (height)
    height = validation.validateHeight(height, "Height");

  if (dateOfBirth) {
    dateOfBirth = validation.checkString(dateOfBirth, "Date of Birth");
    validation.validateDate(dateOfBirth);
    validation.validateBirthday(dateOfBirth);
  }

  if (doctorName)
    doctorName = validation.checkString(doctorName, "Name of Doctor");

  if (conditions)
    conditions = validation.checkStringArray(conditions, "Conditions");

  if (consentLetter)
    consentLetter = validation.checkStringArray(consentLetter, "Letter of Consent");

  if (email) {
    email = validation.checkString(email, "Email");
    validation.validateEmail(email);
  }

  //Create user object to put into collection
  let newUser = {
    firstname: firstname,
    lastname: lastname,
    phonenumber: phonenumber,
    state: state,
    hashedPass: hash,
    meals: [],

    address: address,
    gender: gender,
    height: height,
    weight: weight,
    dateOfBirth: dateOfBirth,
    doctorName: doctorName,
    conditions: conditions,
    consentLetter: consentLetter,

    email: email,
  };

  const userCollection = await users();

  let user = await userCollection.findOne({ phonenumber: phonenumber });
  if (user !== null) throw `User with number ${phonenumber} already exists.`;

  const newInsertInformation = await userCollection.insertOne(newUser);
  if (!newInsertInformation.insertedId) throw "Insert failed";
  return await getUserByID(newInsertInformation.insertedId.toString());
};

const getUserByID = async (id) => {
  id = validation.checkId(id);
  const userCollection = await users();
  const user = await userCollection.findOne({
    _id: new ObjectId(id),
  });
  if (!user) throw "Error: User not found";
  return user;
};

/*
// Function for deleting user in database given the id
const remove = async (id) => {
  id = validation.checkId(id);
  const userCollection = await users();
  const userDeletionInfo = await userCollection.findOneAndDelete({
    _id: new ObjectId(id),
  });

  if (!userDeletionInfo) {
    throw `Could not delete user with id of ${id}`;
  }

  const mealCollection = await meals();
  // Remove user id from the contributors array and unauthorized
  // If the user was in there.
  const updatedMealInfo = await mealCollection.updateMany(
    { _id: new ObjectId(id) },
    {
      $pull: {
        contributors: { $in: [new ObjectId(id)] },
        unauthorized: new ObjectId(id),
      },
    }
  );
  await mealCollection.updateOne(
    { _id: id },
    { $inc: { numContributors: -1 } }
  );

  return `User: ${id} has been deleted`;
};

// Function for updating a user with new descriptions
//! IN THE CLIENTSIDE FORM YOU MUST MAKE IT SO THAT THE FORM LOADS IN WITH THE EXISTING USER DATA
const updateUser = async (id, firstname, lastname, userName) => {
  //* Null Validation
  validation.checkNull(id);
  validation.checkNull(firstname);
  validation.checkNull(lastname);
  validation.checkNull(userName);

  //* id check
  id = validation.checkId(id);

  //* String input check
  firstname = validation.checkString(firstname);
  lastname = validation.checkString(lastname);
  userName = validation.checkString(userName);

  //* Name length check
  if (firstname.length < 2 || firstname.length > 25)
    throw "Error: First name is too short or too long";
  if (lastname.length < 2 || firstname.length > 25)
    throw "Error: Last name is too short or too long";

  const userCollection = await users();
  let user = await userCollection.findOne({ _id: new ObjectId(id) });
  if (!user) throw "Error: User not found!";

  let updateUser = userCollection.updateOne(
    { _id: new ObjectId(id) },
    { $set: { firstname: firstname, lastname: lastname, userName: userName } }
  );

  if (!updateUser) throw "Error: User could not be updated";
  return await getUserByID(id);
};

// Function for adding meals to user
const addMealToUser = async (userId, mealId) => {
  userId = validation.checkId(userId);
  mealId = validation.checkId(mealId);

  const userCollection = await users();
  const mealCollection = await meals();

  // First check if user is already in the contributor or unauthorized list in mealCollection
  let meal = await mealCollection.findOne({ _id: new ObjectId(mealId) });
  if (!meal) throw `Error: Couldn't find meal`;

  // Check if it is a private meal, if so check if creatorId is the userId
  if (meal.creatorId != userId)
    throw "You are not authorized to access this meal";

  // Add user id to meal.contributors
  let updatedContNum = meal.numContributors + 1;
  meal.contributors.push(userId);
  let updateInfo = await mealCollection.updateOne(
    {
      _id: new ObjectId(mealId),
    },
    {
      $set: {
        numContributors: updatedContNum,
        contributors: meal.contributors,
      },
    }
  );
  if (!updateInfo) throw "Error: Insert failed";

  //After user is added to meal, the meal id is put into user's meals Array
  let pushed = await userCollection.updateOne(
    { _id: new ObjectId(userId) },
    { $push: { meals: mealId } }
  );
  if (!pushed) throw "Error: Couldn't update user meallist";
};

const removeMealFromUser = async (userId, mealId) => {
  //Check Null
  validation.checkNull(userId);
  validation.checkNull(mealId);

  //Check Id
  userId = validation.checkId(userId);
  mealId = validation.checkId(mealId);

  //Get collections
  const userCollection = await users();
  const mealCollection = await meals();

  // From the user collection, delete the meal from meals list
  let updatedUser = await userCollection.updateOne(
    { _id: new ObjectId(userId) },
    { $pull: { meals: mealId } }
  );
  if (!updatedUser) throw "Error: User update failed";

  // From the meal collection, delete userId from contributors and decrement contributor count
  let updatedMeal = await mealCollection.updateOne(
    { _id: new ObjectId(mealId) },
    { $pull: { contributors: userId }, $inc: { numContributors: -1 } }
  );
  if (!updatedMeal) throw "Error: Meal update failed";
};
*/

// Function for getting all meals for a user
const getMeals = async (userId) => {
  validation.checkNull(userId);
  userId = validation.checkId(userId);

  //Find user then get the meals that they have
  let user = await getUserByID(userId);
  let userMeals = user.meals.map(function (id) {
    return new ObjectId(id);
  });
  const mealCollection = await meals();
  let foundMeals = await mealCollection
    .find({ _id: { $in: userMeals } })
    .toArray();
  return foundMeals;
};

// Function to return user login information.
const loginUser = async (phonenumber, password) => {
  let userCollection;
  try {
    userCollection = await users();
  } catch (error) {
    return "Database error.";
  }

  phonenumber = validation.checkString(phonenumber, "Phone number");
  validation.validatePassword(password);

  let user = await userCollection.findOne({phonenumber: phonenumber});
  if (user == null) throw "Incorrect Phone number or Password";

  let authenticated = await bcrypt.compare(password, user.hashedPass);
  if (!authenticated) throw "Incorrect Phone number or Password";

  return {
    _id: user._id,
    firstname: user.firstname,
    lastname: user.lastname,
    phonenumber: user.phonenumber,
    state: user.state,
    meals: user.meals,

    address: user.address,
    gender: user.gender,
    height: user.height,
    weight: user.weight,
    dateOfBirth: user.dateOfBirth,
    doctorName: user.doctorName,
    conditions: user.conditions,
    consentLetter: user.consentLetter,

    email: user.email,
  };
};

export default {
  create,
  getUserByID,
  //remove,
  //updateUser,
  //addMealToUser,
  //removeMealsFromUser,
  getMeals,
  loginUser,
};
