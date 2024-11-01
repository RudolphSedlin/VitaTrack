import { meals, users } from "../../config/mongoCollections.js";
import axios from 'axios';

import {expect, jest, test} from '@jest/globals';

import {wrapper} from "axios-cookiejar-support";
import {CookieJar} from "tough-cookie";

let userCollection;
let mealCollection;

let registered;

const jar = new CookieJar();
const client = wrapper(axios.create({ jar }));

beforeAll(async () => {
    userCollection = await users();
    mealCollection = await meals();
}, 30000);

beforeEach(async () => {
    await userCollection.deleteMany({});
    await mealCollection.deleteMany({});

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
                                        consentLetter: "I pledge allegiance to the flag of the United States of America, and to the Republic for which it stands, one nation, under god, indivisible, with liberty, and justice for all.",

                                        email: "BeeMail@bees.org",
                                        height: 80,
                                        weight: 220
                                    },
                                    {withCredentials: true}
    )).data;

}, 30000);

afterAll(async () => {
    await userCollection.deleteMany({});
    await mealCollection.deleteMany({});
}, 30000);

test("Unauthenticated Test", async () => {

    await client.get('http://localhost:3000/logout', {withCredentials: true});

    try {
        await client.get('http://localhost:3000/user', {withCredentials: true});
    }
    catch (error) {
        expect(error.status).toEqual(403);
    }

    try {
        await client.put('http://localhost:3000/user', {withCredentials: true});
    }
    catch (error) {
        expect(error.status).toEqual(403);
    }

    try {
        await client.delete('http://localhost:3000/user', {withCredentials: true});
    }
    catch (error) {
        expect(error.status).toEqual(403);
    }

}, 30000);

test("Get Test", async () => {

    let session = (await client.get('http://localhost:3000/user', {withCredentials: true})).data;
    expect(session).toMatchObject(registered);

}, 30000);

test("Put Fail Test", async () => {

    try {
        let updated = (await client.put('http://localhost:3000/user',
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
                                    },
                                    {withCredentials: true}
        )).data;
    }
    catch (error) {
        expect(error.status).toEqual(403);
    }

}, 30000);

test("Put Success Test", async () => {

    let updated = (await client.put('http://localhost:3000/user',
                                {
                                    firstName: "New",
                                    lastName: "Users",
                                    phoneNumber: "1-800-999-1234",
                                    state: "NJ",
                                    password: "SamplePassWord123456789+",

                                    address: "Mount Everest",
                                    gender: "Alien",
                                    dateOfBirth: "1970-01-02",
                                    doctorName: "Doctor Frankenstein's Mistress",
                                    consentLetter: "I DO NOT pledge allegiance to the flag of the United States of America, and to the Republic for which it stands, one nation, under god, indivisible, with liberty, and justice for all.",

                                    email: "BeeMail2@bees.org",
                                    height: 90,
                                    weight: 250
                                },
                                {withCredentials: true}
    )).data;

    let session = (await client.get('http://localhost:3000/user', {withCredentials: true})).data;

    expect(updated).not.toMatchObject(registered);
    expect(updated).toMatchObject(session);

}, 30000);

test("Delete Test", async () => {

    let deleted;

    deleted = (await client.delete('http://localhost:3000/user',
                                   {withCredentials: true}
    )).data;

    expect(deleted).toBe("User deleted!");

}, 30000);
