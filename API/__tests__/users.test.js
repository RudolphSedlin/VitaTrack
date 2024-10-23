import {expect, jest, test} from '@jest/globals';

import { userData, mealData } from "../data/index.js";
import { meals, users } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import bcrypt from "bcrypt";
import validation from "../validation.js";

// Wipe databases beforehand to avoid re-registration errors.
const userCollection = await users();
const mealCollection = await meals();

userCollection.deleteMany({});
mealCollection.deleteMany({});

test("Registration and Login Test", async () => {
    let registered = await userData.create(
        "Test",
        "User",
        "1-800-999-9999",
        "NY",
        "SamplePassWord12345+",

        "Mount Marcy",
        "Yeti",
        "1970-01-01",
        "Doctor Frankenstein",
        ["Zombism", "Social Isolation", "Super Strength", "Super Intelligence"],
        "I pledge allegiance to the flag of the United States of America, and to the Republic for which it stands, one nation, under god, indivisible, with liberty, and justice for all.",

        "BeeMail@bees.org",
        80,
        220
    );

    let loggedIn = await userData.loginUser(
        "1-800-999-9999",
        "SamplePassWord12345+"
    );

    expect(loggedIn).toMatchObject(registered);
    console.log(loggedIn);
});
