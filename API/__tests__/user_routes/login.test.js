import axios from 'axios';

import {expect, jest, test} from '@jest/globals';

import {wrapper} from "axios-cookiejar-support";
import {CookieJar} from "tough-cookie";

import clean from "../../tasks/clean.js";

let registered;

const jar = new CookieJar();
const client = wrapper(axios.create({ jar }));

beforeEach(async () => {
    await clean();

    registered = (await client.post('http://localhost:3000/register',
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

}, 30000);

test("Empty Request Test", async () => {

    try {
        await client.post('http://localhost:3000/login',
                          {
                          }
        )
    }
    catch (error) {
        expect(error.status).toEqual(400);
    }

}, 30000);

test("Bad Username Test", async () => {

    try {
        await client.post('http://localhost:3000/login',
                          {
                              phoneNumber: "1-800-999-9998",
                              password: "SamplePassWord12345+",
                          }
        )
    }
    catch (error) {
        expect(error.status).toEqual(400);
    }

}, 30000);

test("Bad Password Test", async () => {

    try {
        await client.post('http://localhost:3000/login',
                          {
                              phoneNumber: "1-800-999-9999",
                              password: "SamplePassWord1234+",
                          }
        )
    }
    catch (error) {
        expect(error.status).toEqual(400);
    }

}, 30000);

test("Success Test", async () => {

    let loggedIn = (await client.post('http://localhost:3000/login',
                                      {
                                          phoneNumber: "1-800-999-9999",
                                          password: "SamplePassWord12345+",
                                      }
    )).data;
    expect(loggedIn).toMatchObject(registered);

}, 30000);
