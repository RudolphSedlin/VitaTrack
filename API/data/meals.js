import validation from "../validation.js";
import { ObjectId } from "mongodb";
import { meals, users } from "../config/mongoCollections.js";
import { userData } from "./index.js";

// Create a new meal
const create = async (
  name,
  description,
  creatorId,
  servings,
  caloriesPerServing,
  nutrientsPerServing
) => {
  let dateCreated = new Date().toUTCString();

  //Create meal obj to put into collection
  let newMeal = {
    name: name,
    description: description,
    creatorId: creatorId,
    dateCreated: dateCreated,
    servings: servings,
    caloriesPerServing: caloriesPerServing,
    nutrientsPerServing: nutrientsPerServing
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

  return await getByID(newInsertInformation.insertedId.toString());
};

const getByID = async (id) => {
  id = validation.checkId(id);
  const mealCollection = await meals();
  const meal = await mealCollection.findOne({
    _id: new ObjectId(id),
  });
  if (!meal) throw "Error: Meal not found";
  return meal;
};

export default {
  create,
  getByID,
};
