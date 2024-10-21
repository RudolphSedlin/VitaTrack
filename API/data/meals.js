import validation from "../validation.js";
import { ObjectId } from "mongodb";
import { meals, users } from "../config/mongoCollections.js";
import { userData } from "./index.js";

// Create a new meal
const create = async (
  name,
  description,
  creatorId,
) => {
  //Validate Null
  validation.checkNull(name);
  validation.checkNull(description);
  validation.checkNull(creatorId);

  //Input validation for types
  name = validation.checkString(name, "Meal Name");
  description = validation.checkString(description, "Description");
  if (name.length < 2 || name.length > 50)
    throw "Error: Meal Name is too short or too long";
  if (description.length < 15 || description.length > 250)
    throw "Error: Description is too short or too long";

  creatorId = validation.checkId(creatorId, "Creator ID");

  let dateCreated = new Date().toUTCString();

  //Create meal obj to put into collection
  let newMeal = {
    name: name,
    description: description,
    creatorId: creatorId,
    dateCreated: dateCreated,
  };

  //* Add the meal to the meal collection
  const mealCollection = await meals();
  const newInsertInformation = await mealCollection.insertOne(newMeal);
  if (!newInsertInformation.insertedId) throw "Insert failed";

  //* Update user mealList
  const userCollection = await users();
  const updateUser = await userCollection.updateOne(
    { _id: new ObjectId(creatorId) },
    { $push: { meals: newInsertInformation.insertedId.toString() } }
  );

  return await getMealByID(newInsertInformation.insertedId.toString());
};

const getMealByID = async (id) => {
  id = validation.checkId(id);
  const mealCollection = await meals();
  const meal = await mealCollection.findOne({
    _id: new ObjectId(id),
  });
  if (!meal) throw "Error: Meal not found";
  return meal;
};

const deleteMeal = async (userId, mealId) => {
  //Todo
  //* Start Validation
  validation.checkNull(userId);
  validation.checkNull(mealId);
  userId = validation.checkId(userId);
  mealId = validation.checkId(mealId);

  //* Get collections
  const mealCollection = await meals();
  const userCollection = await users();

  //* Check and see if userId = creatorId
  let meal = await getMealByID(mealId);
  if (userId.localeCompare(meal.creatorId) != 0)
    throw "Error: User is not the creator of the meal!";

  //* Delete the meal from mealCollection
  let deletedMeal = await mealCollection.findOneAndDelete({
    _id: new ObjectId(mealId),
  });
  if (!deletedMeal) throw "Error: Meal couldn't be deleted";

  //* Go through all users and delete mealId from meal list if they have it
  await userCollection.updateMany({}, { $pull: { meals: mealId } });
  return { meal: mealId, deleted: true };
};

export default {
  create,
  getMealByID,
  deleteMeal,
};
