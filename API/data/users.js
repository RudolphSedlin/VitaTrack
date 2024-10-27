import validation from "../validation.js";
import { ObjectId } from "mongodb";
import { meals, users } from "../config/mongoCollections.js";
import bcrypt from "bcrypt";
import { mealData } from "./index.js";

// Function for creating a user in the user data base
const create = async (
  firstName,
  lastName,
  phoneNumber,
  state,
  password, // MANDATORY NO MATTER WHAT

  address,
  gender,
  dateOfBirth,
  doctorName,
  conditions,
  consentLetter, // Also stored for RPM customers.

  email, // Completely optional.
  height,
  weight,
) => {

  //Validation Handling For Mandatory---------------------------------------------------------------------------------
  //* Validate Null
  validation.checkNull(firstName);
  validation.checkNull(lastName);
  validation.checkNull(phoneNumber);
  validation.checkNull(state);
  validation.checkNull(password);

  // * Validate String params
  firstName = validation.checkString(firstName, "First Name");
  lastName = validation.checkString(lastName, "Last Name");
  phoneNumber = validation.checkString(phoneNumber, "Phone number");
  state = validation.checkString(state, "State");
  password = validation.checkString(password, "Password");


  //* Name length check
  if (firstName.length < 2 || firstName.length > 25)
    throw "Error: First name is too short or too long";
  if (lastName.length < 2 || lastName.length > 25)
    throw "Error: Last name is too short or too long";

  validation.validatePassword(password);

  const saltRounds = 16;
  const hash = await bcrypt.hash(password, saltRounds);

  //Validation Handling For RPM/Optional----------------------------------------------------------------------------------------
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
    doctorName = validation.checkString(doctorName, "Name of Doctor");

  /*
  if (conditions)
    validation.checkStringArray(conditions, "Conditions");
  */

  if (consentLetter)
    consentLetter = validation.checkString(consentLetter, "Letter of Consent");

  if (email) {
    email = validation.checkString(email, "Email");
    validation.validateEmail(email);
  }

  if (height)
    validation.validateHeight(height, "Height");

  if (weight)
    validation.validateWeight(weight, "Weight");

  //Create user object to put into collection
  let newUser = {
    firstName: firstName,
    lastName: lastName,
    phoneNumber: phoneNumber,
    state: state,
    hashedPass: hash,
    meals: [],

    address: address,
    gender: gender,
    dateOfBirth: dateOfBirth,
    doctorName: doctorName,
    conditions: conditions,
    consentLetter: consentLetter,

    email: email,
    height: height,
    weight: weight,
  };

  const userCollection = await users();

  let user = await userCollection.findOne({ phoneNumber: phoneNumber });
  if (user !== null) throw `User with number ${phoneNumber} already exists.`;

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
  const {hashedPass, ...allElse} = user;
  return allElse;
};

// Function for deleting user in database given the id
const remove = async (id) => {
  id = validation.checkId(id);
  const userCollection = await users();
  const userDeletionInfo = await userCollection.findOneAndDelete({
    _id: new ObjectId(id),
  });

  if (!userDeletionInfo)
    throw `Could not delete user with id of ${id}`;

  const mealCollection = await meals();
  // Remove user meals.
  const updatedMealInfo = await mealCollection.deleteMany(
    {creatorId: id}
  );

  return `User: ${id} has been deleted`;
};


// Function for updating a user
const updateUser = async (user) => {
  //* Null Validation
  let id = user._id;
  validation.checkNull(id);

  //* id check
  id = validation.checkId(id);

  let {_id, ...nonId} = user;
  user = nonId;

  //* Name length check
  if (user.firstName && (user.firstName.length < 2 || user.firstName.length > 25))
    throw "Error: First name is too short or too long";
  if (user.lastName && (user.lastName.length < 2 || user.lastName.length > 25))
    throw "Error: Last name is too short or too long";

  if (user.hashedPass)
    throw `Cannot update password hash.`;

  if (user.password) {
    const saltRounds = 16;
    const hash = await bcrypt.hash(user.password, saltRounds);
    user.hashedPass = hash;
    let {password, ...allElse} = user;
    user = allElse;
  }

  if (user.meals)
    throw `User cannot change meals in this way.`;

  const userCollection = await users();
  let foundUser = await userCollection.findOne({ _id: new ObjectId(id) });
  if (!foundUser) throw "Error: User not found!";

  for (let field in user)
    if (!foundUser[field])
      throw `Field ${field} does not belong to the user.`;

  let updateUser = await userCollection.updateOne(
    { _id: new ObjectId(id) },
    { $set: user },
    { new: true }
  );

  if (!updateUser) throw "Error: User could not be updated";
  return await getUserByID(id);
};

/*
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

// Function for getting all meals for a user
const getMealsToday = async (userId) => {
  let allMeals = await getMeals(userId);
  let output = [];
  let today = new Date(); // There really doesn't seem to be a better way to do this. Really, Date should implement this but okay.
  for (let meal of allMeals) {
    let mealDate = new Date(meal.dateCreated);
    if (today.getUTCFullYear() === mealDate.getUTCFullYear()
      && today.getUTCMonth() === mealDate.getUTCMonth()
    && today.getUTCDate() === mealDate.getUTCDate())
      output.push(meal);
  }

  return output;
};

// Function to return user login information.
const loginUser = async (phoneNumber, password) => {
  let userCollection;
  try {
    userCollection = await users();
  } catch (error) {
    return "Database error.";
  }

  phoneNumber = validation.checkString(phoneNumber, "Phone number");
  validation.validatePassword(password);

  let user = await userCollection.findOne({phoneNumber: phoneNumber});
  if (user == null) throw "Incorrect Phone number or Password";

  let {hashedPass, ...allElse} = user;
  let authenticated = await bcrypt.compare(password, hashedPass);
  if (!authenticated) throw "Incorrect Phone number or Password";

  return allElse;
};

export default {
  create,
  getUserByID,
  remove,
  updateUser,
  //addMealToUser,
  //removeMealsFromUser,
  getMeals,
  getMealsToday,
  loginUser,
};
