import { meals, users } from "../config/mongoCollections.js";
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






test("Routes Test", async () => { // Check routes by error codes. Bad routes 404, but other routes will 400 or 403 due to bad requests.

    try {
        await client.post('http://localhost:3000/login',
                         {
                         }
        )
    }
    catch (error) {
        console.log(error.response.data);
        expect(error.status).toEqual(400);
    }

    try {
        await client.post('http://localhost:3000/register',
                         {
                         }
        )
    }
    catch (error) {
        console.log(error.response.data);
        expect(error.status).toEqual(400);
    }

    try {
        await client.get('http://localhost:3000/user',
                         {
                         }
        )
    }
    catch (error) {
        console.log(error.response.data);
        expect(error.status).toEqual(403);
    }

    try {
        await client.get('http://localhost:3000/meals',
                        {
                        }
        )
    }
    catch (error) {
        console.log(error.response.data);
        expect(error.status).toEqual(403);
    }

    try {
        await client.get('http://localhost:3000/logout',
                        {
                        }
        )
    }
    catch (error) {
        expect(error.status).toEqual(403);
    }

    //---------------------------------------------------------------------------------------------------------------------

    try {
        await client.get(`http://localhost:3000/${crypto.randomBytes(16).toString('hex')}`,
                        {
                        }
        )
    }
    catch (error) {
        console.log(error.response.data);
        expect(error.status).toEqual(404);
    }

}, 30000);








test("Register Route Test", async () => {

    try {
        await client.post('http://localhost:3000/register',
                         {
                         }
        )
    }
    catch (error) {
        console.log(error.response.data);
        expect(error.status).toEqual(400);
    }

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
        console.log(error.response.data);
        expect(error.status).toEqual(400);
    }

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
        console.log(error.response.data);
        expect(error.status).toEqual(400);
    }

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
        console.log(error.response.data);
        expect(error.status).toEqual(400);
    }


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
        console.log(error.response.data);
        expect(error.status).toEqual(400);
    }

    //-------------------------------------------------------------------------------------------------------------------------------------------------

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







test("Login Route Test", async () => {

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
                                           conditions: ["Zombism", "Social Isolation", "Super Strength", "Super Intelligence"],
                                           consentLetter: "I pledge allegiance to the flag of the United States of America, and to the Republic for which it stands, one nation, under god, indivisible, with liberty, and justice for all.",

                                           email: "BeeMail@bees.org",
                                           height: 80,
                                           weight: 220
                                       }
    )).data;

    let loggedIn = (await client.post('http://localhost:3000/login',
                                     {
                                         phoneNumber: "1-800-999-9999",
                                         password: "SamplePassWord12345+",
                                     }
    )).data;

    expect(loggedIn).toMatchObject(registered);

    //------------------------------------------------------------------------------------------------------------------------

    try {
        await client.post('http://localhost:3000/login',
                         {
                         }
        )
    }
    catch (error) {
        console.log(error.response.data);
        expect(error.status).toEqual(400);
    }

    try {
        await client.post('http://localhost:3000/login',
                         {
                             phoneNumber: "1-800-999-9998",
                             password: "SamplePassWord12345+",
                         }
        )
    }
    catch (error) {
        console.log(error.response.data);
        expect(error.status).toEqual(400);
    }

    try {
        await client.post('http://localhost:3000/login',
                         {
                             phoneNumber: "1-800-999-9999",
                             password: "SamplePassWord1234+",
                         }
        )
    }
    catch (error) {
        console.log(error.response.data);
        expect(error.status).toEqual(400);
    }

}, 30000);





test("User Route Test", async () => {

    try {
        await client.get('http://localhost:3000/user', {withCredentials: true});
    }
    catch (error) {
        console.log(error.response.data);
        expect(error.status).toEqual(403);
    }

    //-------------------------------------------------------------------------------------------------------------------------------------------------

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
                                       },
                                       {withCredentials: true}
    )).data;

    let session = (await client.get('http://localhost:3000/user', {withCredentials: true})).data;

    expect(registered).toMatchObject(session);

}, 30000);

