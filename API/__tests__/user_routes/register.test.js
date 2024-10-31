import { meals, users } from "../../config/mongoCollections.js";
import axios from 'axios';
import crypto from "crypto";

import {expect, jest, test} from '@jest/globals';

import {wrapper} from "axios-cookiejar-support";
import {CookieJar} from "tough-cookie";

let userCollection;
let mealCollection;

const jar = new CookieJar();
const client = wrapper(axios.create({ jar }));

beforeAll(async () => {
    userCollection = await users();
    mealCollection = await meals();
}, 30000);

beforeEach(async () => {
    await userCollection.deleteMany({});
    await mealCollection.deleteMany({});
}, 30000);

afterAll(async () => {
    await userCollection.deleteMany({});
    await mealCollection.deleteMany({});
}, 30000);

test("Empty Request Test", async () => {

    try {
        await client.post('http://localhost:3000/register',
                          {
                          }
        )
    }
    catch (error) {
        expect(error.status).toEqual(400);
    }

}, 30000);

test("Bad Password Test", async () => {

    try {
        await client.post('http://localhost:3000/register',
                          {
                              firstName: "Test",
                              lastName: "User",
                              phoneNumber: "1-800-999-9999",
                              state: "NY",
                              password: "SamplePassWord",
                              confirmPassword: "SamplePassWord",

                              address: "Mount Marcy",
                              gender: "Monster",
                              dateOfBirth: "1970-01-01",
                              doctorName: "Doctor Frankenstein",
                              consentLetter: "I pledge allegiance to the flag of the United States of America, and to the Republic for which it stands, one nation, under god, indivisible, with liberty, and justice for all.",

                              email: "BeeMail@bees.org",
                              height: 80,
                              weight: 220
                          }
        )
    }
    catch (error) {
        expect(error.status).toEqual(400);
    }

}, 30000);

test("Inconsistent Confirm Password Test", async () => {

    try {
        await client.post('http://localhost:3000/register',
                          {
                              firstName: "Test",
                              lastName: "User",
                              phoneNumber: "1-800-999-9999",
                              state: "NY",
                              password: "SamplePassWord12345+",
                              confirmPassword: "SamplePassWord1234+",

                              address: "Mount Marcy",
                              gender: "Monster",
                              dateOfBirth: "1970-01-01",
                              doctorName: "Doctor Frankenstein",
                              consentLetter: "I pledge allegiance to the flag of the United States of America, and to the Republic for which it stands, one nation, under god, indivisible, with liberty, and justice for all.",

                              email: "BeeMail@bees.org",
                              height: 80,
                              weight: 220
                          }
        )
    }
    catch (error) {
        expect(error.status).toEqual(400);
    }

}, 30000);

test("Bad Email Test", async () => {

    try {
        await client.post('http://localhost:3000/register',
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
                              consentLetter: "I pledge allegiance to the flag of the United States of America, and to the Republic for which it stands, one nation, under god, indivisible, with liberty, and justice for all.",

                              email: "BeeMail@bees",
                              height: 80,
                              weight: 220
                          }
        )
    }
    catch (error) {
        expect(error.status).toEqual(400);
    }

}, 30000);

test("Missing Fields Test", async () => {

    try {
        await client.post('http://localhost:3000/register',
                          {
                              firstName: "Test",
                              lastName: "User",
                              phoneNumber: "1-800-999-9999",
                          }
        )
    }
    catch (error) {
        expect(error.status).toEqual(400);
    }

}, 30000);

test("Success Test", async () => {

    let registered = (await client.post('http://localhost:3000/register',
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
                                            consentLetter: "I pledge allegiance to the flag of the United States of America, and to the Republic for which it stands, one nation, under god, indivisible, with liberty, and justice for all.",

                                            email: "BeeMail@bees.org",
                                            height: 80,
                                            weight: 220
                                        }
    )).data;

    let Franklin = {
        firstName: "Test",
        lastName: "User",
        phoneNumber: "1-800-999-9999",
        state: "NY",

        address: "Mount Marcy",
        gender: "Monster",
        dateOfBirth: "1970-01-01",
        doctorName: "Doctor Frankenstein",
        consentLetter: "I pledge allegiance to the flag of the United States of America, and to the Republic for which it stands, one nation, under god, indivisible, with liberty, and justice for all.",

        email: "BeeMail@bees.org",
        height: "80",
        weight: "220",

        meals: []
    }

    expect(registered).toMatchObject(Franklin);

}, 30000);
