import seed from "../../tasks/seed.js";
import clean from "../../tasks/clean.js";
import axios from 'axios';

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
        await client.get('http://localhost:3000/meals/today', {withCredentials: true});
    }
    catch (error) {
        expect(error.status).toEqual(403);
    }
});

test("Get Test", async () => {
    let today = new Date();
    let mealList = (await client.get(`http://localhost:3000/meals/today`, {withCredentials: true})).data.mealList;

    for (let meal of mealList) {
        let mealDate = new Date(meal.dateCreated);

        expect(today.getUTCFullYear()).toEqual(mealDate.getUTCFullYear());
        expect(today.getUTCMonth()).toEqual(mealDate.getUTCMonth());
        expect(today.getUTCDate()).toEqual(mealDate.getUTCDate());
    };
});
