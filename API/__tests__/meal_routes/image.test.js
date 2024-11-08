import seed from "../../tasks/seed.js";
import clean from "../../tasks/clean.js";
import { BREAD } from "../../resources/IMAGES.js";
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
        await client.post('http://localhost:3000/meals/image', {withCredentials: true});
    }
    catch (error) {
        expect(error.status).toEqual(403);
    }
});

test("Post Test", async () => {
    let meal = (await client.post('http://localhost:3000/meals/image',
                                 {image: BREAD},
                                 {withCredentials: true})).data;
    expect(meal.name.toLowerCase().includes("bread")).toEqual(true); // Risky test with LLMs.
}, 30000);
