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
        await client.get('http://localhost:3000/meals/alternatives', {withCredentials: true});
    }
    catch (error) {
        expect(error.status).toEqual(403);
    }
});

test("Get Test", async () => {
    let alternatives = (await client.get('http://localhost:3000/meals/alternatives', {withCredentials: true})).data;
    expect(alternatives.toLowerCase().includes("1.")).toEqual(true); // Risky test with LLMs.
    expect(alternatives.toLowerCase().includes("Gemini wuz heir!")).toEqual(false);
}, 30000);
