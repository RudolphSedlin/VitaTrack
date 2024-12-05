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

// Function for evaluating measures of central tendency among meal data.
const evaluateAggregates = (meals) => {
  if (!Array.isArray(meals) || !meals.length) {
    return {};
  };

  let output = {
    calories: {
      count: 0,
      total: 0,
      avg: 0,
      max: 0,
      min: Number.MAX_SAFE_INTEGER,
    }
  };

  for (let meal of meals) {
    let calories = meal.caloriesPerServing * meal.servings;

    output.calories.count++;
    output.calories.total += calories;
    output.calories.avg = output.calories.total / output.calories.count;
    output.calories.max = calories > output.calories.max ? calories : output.calories.max;
    output.calories.min = calories < output.calories.min ? calories : output.calories.min;

    for (let nutrientCategory in meal.nutrientsPerServing) {
      if (!output[nutrientCategory])
        output[nutrientCategory] = {};

      for (let nutrient in (meal.nutrientsPerServing)[nutrientCategory]) {
        if (!(output[nutrientCategory][nutrient]))
          output[nutrientCategory][nutrient] = {
            count: 0,
            total: 0,
            avg: 0,
            max: 0,
            min: Number.MAX_SAFE_INTEGER,
          };

        let quant = meal.nutrientsPerServing[nutrientCategory][nutrient] * meal.servings;
        output[nutrientCategory][nutrient].count++;
        output[nutrientCategory][nutrient].total += quant;
        output[nutrientCategory][nutrient].avg = output[nutrientCategory][nutrient].total / output[nutrientCategory][nutrient].count;
        output[nutrientCategory][nutrient].max = quant > output[nutrientCategory][nutrient].max ? quant : output[nutrientCategory][nutrient].max;
        output[nutrientCategory][nutrient].min = quant < output[nutrientCategory][nutrient].min ? quant : output[nutrientCategory][nutrient].min;
      }

    }
  }

  return output;
};

export default {
  create,
  getByID,
  remove,
  evaluateAggregates
};
