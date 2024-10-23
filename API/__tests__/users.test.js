import { userData, mealData } from "../data/index.js";
import { meals, users } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import bcrypt from "bcrypt";
import validation from "../validation.js";
import axios from 'axios';

import {expect, jest, test} from '@jest/globals';

let userCollection;
let mealCollection;

beforeAll(async () => {
    userCollection = await users();
    mealCollection = await meals();
}, 10000);

beforeEach(async () => {
    userCollection.deleteMany({});
    mealCollection.deleteMany({});
}, 10000);


test("Login Route Test", async () => {
    let registered = (await axios.post('http://localhost:3000/register',
                                       {
                                           firstName: "Test",
                                           lastName: "User",
                                           phoneNumber: "1-800-999-9999",
                                           state: "NY",
                                           password: "SamplePassWord12345+",
                                           confirmPassword: "SamplePassWord12345+",

                                           address: "Mount Marcy",
                                           gender: "Monster",
                                           dateOfBirth: "1970-01-01",
                                           doctorName: "Doctor Frankenstein",
                                           conditions: ["Zombism", "Social Isolation", "Super Strength", "Super Intelligence"],
                                           consentLetter: "I pledge allegiance to the flag of the United States of America, and to the Republic for which it stands, one nation, under god, indivisible, with liberty, and justice for all.",

                                           email: "BeeMail@bees.org",
                                           height: 80,
                                           weight: 220
                                       }
    )).data;

    let loggedIn = (await axios.post('http://localhost:3000/login',
                                     {
                                         phoneNumber: "1-800-999-9999",
                                         password: "SamplePassWord12345+",
                                     }
    )).data;

    expect(loggedIn).toMatchObject(registered);
}, 10000);

