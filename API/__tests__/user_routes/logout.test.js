import axios from 'axios';

import {expect, jest, test} from '@jest/globals';

import {wrapper} from "axios-cookiejar-support";
import {CookieJar} from "tough-cookie";

import clean from "../../tasks/clean.js";

const jar = new CookieJar();
const client = wrapper(axios.create({ jar }));

beforeAll(async () => {
    await clean();
}, 30000);

test("Unauthenticated Test", async () => {

    try {
        await client.get('http://localhost:3000/user', {withCredentials: true});
    }
    catch (error) {
        expect(error.status).toEqual(403);
    }

}, 30000);

test("Authenticated Test", async () => {
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

    let logged_out = (await client.get('http://localhost:3000/logout', {withCredentials: true})).data;

    expect(logged_out).toBe("Logged out!");
}, 30000);
