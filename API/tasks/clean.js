import { meals, users } from "../config/mongoCollections.js";

let userCollection = await users();
let mealCollection = await meals();

await userCollection.deleteMany({});
await mealCollection.deleteMany({});

console.log("Done deleting! Happy repopulating :D!");
