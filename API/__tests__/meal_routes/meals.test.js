import seed from "../../tasks/seed.js";
import clean from "../../tasks/clean.js";
import axios from 'axios';

import {expect, jest, test} from '@jest/globals';

import {wrapper} from "axios-cookiejar-support";
import {CookieJar} from "tough-cookie";

const jar = new CookieJar();
const client = wrapper(axios.create({ jar }));

beforeAll(async () => {// Silence logs by wrapping seeder with spyOn// Temporarily silence console.log for the whole `beforeAll` block
    const originalConsoleLog = console.log;
    console.log = () => {}; // Override with a no-op

    // Run the seeder and await completion if it returns a promise
    await clean();
    await seed();

    // Restore the original console.log after the seeder has completed
    console.log = originalConsoleLog;
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
