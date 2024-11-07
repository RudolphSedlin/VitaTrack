import validation from "../validation.js";
import { ObjectId } from "mongodb";
import { users } from "../config/mongoCollections.js";
import bcrypt from "bcrypt";
import { mealData } from "./index.js";
import { SALT_ROUNDS } from "../resources/CONSTANTS.js";

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
  allergies,
  intolerances
) => {

  const hash = await bcrypt.hash(password, SALT_ROUNDS);

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
    allergies: allergies,
    intolerances: intolerances,
  };

  const userCollection = await users();

  let user = await userCollection.findOne({ phoneNumber: phoneNumber });
  if (user !== null) throw `User with number ${phoneNumber} already exists.`;

  const newInsertInformation = await userCollection.insertOne(newUser);
  if (!newInsertInformation.insertedId) throw "Insert failed";
  return await getByID(newInsertInformation.insertedId.toString());
};

const getByID = async (id) => {
  const userCollection = await users();
  const user = await userCollection.findOne({
    _id: new ObjectId(id),
  });
  if (!user) throw "Error: User not found";
  delete user.hashedPass;
  return user;
};

// Function for deleting user in database given the id
const remove = async (id) => {
  let user = await getByID(id);

  for (let meal of user.meals)
    await mealData.remove(meal);

  const userCollection = await users();
  const userDeletionInfo = await userCollection.findOneAndDelete({
    _id: new ObjectId(id),
  });

  if (!userDeletionInfo)
    throw `Could not delete user with id of ${id}`;

  return `User: ${id} has been deleted`;
};


// Function for updating a user
const update = async (user) => {
  let id = user._id;
  delete user._id;

  if (user.password) {
    const hash = await bcrypt.hash(user.password, SALT_ROUNDS);
    user.hashedPass = hash;
    delete user.password;
  }

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
  return await getByID(id);
};

// Function for getting all meals for a user
const getMeals = async (userId) => {
  //Find user then get the meals that they have
  let user = await getByID(userId);

  let foundMeals = [];
  for (let meal of user.meals)
    foundMeals.push(await mealData.getByID(meal));

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

const addMeal = async (userId, mealId) => {
  const userCollection = await users();
  const updateUser = await userCollection.updateOne(
    { _id: new ObjectId(userId) },
    { $push: { meals: mealId } }
  );
  return updateUser;
};

const removeMeal = async (userId, mealId) => {
  const userCollection = await users();
  const updateUser = await userCollection.updateOne(
    { _id: new ObjectId(userId) },
    { $pull: { meals: mealId } }
  );
  return updateUser;
};

// Function to return user login information.
const login = async (phoneNumber, password) => {
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

  let authenticated = await bcrypt.compare(password, user.hashedPass);
  if (!authenticated) throw "Incorrect Phone number or Password";

  delete user.hashedPass;
  return user;
};

export default {
  create,
  getByID,
  remove,
  update,
  getMeals,
  getMealsToday,
  addMeal,
  removeMeal,
  login,
};
