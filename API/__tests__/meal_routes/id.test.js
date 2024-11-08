import seed from "../../tasks/seed.js";
import clean from "../../tasks/clean.js";
import axios from 'axios';
import crypto from 'crypto';

import {expect, jest, test} from '@jest/globals';

import {wrapper} from "axios-cookiejar-support";
import {CookieJar} from "tough-cookie";

const jar = new CookieJar();
const client = wrapper(axios.create({ jar }));

let loggedIn;

beforeAll(async () => {
    await clean();
    await seed();
});

beforeEach(async () => {
    loggedIn = (await client.post('http://localhost:3000/login',
                                  {
                                      phoneNumber: "1-800-999-9999",
                                      password: "SamplePassWord12345+",
                                  },
                                  {withCredentials: true}
    )).data;
});

test("Unauthenticated Test", async () => {

    await client.get('http://localhost:3000/logout', {withCredentials: true});

    try {
        await client.get(`http://localhost:3000/meals/${loggedIn.meals[0]}`, {withCredentials: true});
    }
    catch (error) {
        expect(error.status).toEqual(403);
    }
});

test("Get Test", async () => {

    try {
        await client.get(`http://localhost:3000/meals/${crypto.randomBytes(16).toString('hex')}`, {withCredentials: true});
    }
    catch (error) {
        expect(error.status).toEqual(404);
    }

    let meal = (await client.get(`http://localhost:3000/meals/${loggedIn.meals[0]}`, {withCredentials: true})).data;
    expect(meal.name).toEqual("Cookies");
});
