import validation from "../validation.js";
import { ObjectId } from "mongodb";
import { meals } from "../config/mongoCollections.js";
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

  await userData.addMeal(creatorId, newInsertInformation.insertedId);

  return await getByID(newInsertInformation.insertedId.toString());
};

const getByID = async (id) => {
  const mealCollection = await meals();
  const meal = await mealCollection.findOne({
    _id: new ObjectId(id),
  });
  if (!meal) throw "Error: Meal not found";
  return meal;
};

const remove = async (id) => {
  let meal = await getByID(id);
  await userData.removeMeal(meal.creatorId, id);

  const mealCollection = await meals();
  const mealDeletionInfo = await mealCollection.findOneAndDelete({
    _id: new ObjectId(id),
  });

  if (!mealDeletionInfo)
    throw `Could not delete meal with id of ${id}`;

  return `Meal: ${id} has been deleted`;
};

export default {
  create,
  getByID,
  remove
};
