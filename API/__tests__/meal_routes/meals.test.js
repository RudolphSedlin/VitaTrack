import seed from "../../tasks/seed.js";
import clean from "../../tasks/clean.js";
import axios from 'axios';

import {expect, jest, test} from '@jest/globals';

import {wrapper} from "axios-cookiejar-support";
import {CookieJar} from "tough-cookie";

const jar = new CookieJar();
const client = wrapper(axios.create({ jar }));

beforeAll(async () => {// Silence logs by wrapping seeder with spyOn// Temporarily silence console.log for the whole `beforeAll` block
    await clean();
    await seed();
}, 30000);

afterAll(async () => {
    await clean();
}, 30000);

test("Unauthenticated Test", async () => {

    try {
        await client.get('http://localhost:3000/meals', {withCredentials: true});
    }
    catch (error) {
        expect(error.status).toEqual(403);
    }

    try {
        await client.post('http://localhost:3000/meals', {withCredentials: true});
    }
    catch (error) {
        expect(error.status).toEqual(403);
    }

}, 30000);
