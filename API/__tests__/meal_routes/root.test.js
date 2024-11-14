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
        await client.get('http://localhost:3000/meals', {withCredentials: true});
    }
    catch (error) {
        expect(error.status).toEqual(403);
    }
});

test("Get Test", async () => {
    let mealList = (await client.get(`http://localhost:3000/meals`, {withCredentials: true})).data.mealList;
    expect(mealList[0].name).toEqual("Cookies");
});

test("Post Test", async () => {
    await client.post('http://localhost:3000/meals', {
        name: "Sour Cream",
        description: "There is nothing whiter than this baby!",
        servings: 4,
        caloriesPerServing: 1000,
        nutrientsPerServing: JSON.stringify({
            protein: {
                total: 30
            }
        })
    },
    {withCredentials: true}
    );

    let mealList = (await client.get(`http://localhost:3000/meals`, {withCredentials: true})).data.mealList;
    expect(mealList[2].name).toEqual("Sour Cream");
});
