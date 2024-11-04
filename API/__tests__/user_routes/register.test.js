import axios from 'axios';

import {expect, jest, test} from '@jest/globals';

import {wrapper} from "axios-cookiejar-support";
import {CookieJar} from "tough-cookie";

import clean from "../../tasks/clean.js";

const jar = new CookieJar();
const client = wrapper(axios.create({ jar }));

beforeEach(async () => {
    await clean();
});

test("Empty Request Test", async () => {

    try {
        await client.post('http://localhost:3000/register',
                          {
                          }
        )
    }
    catch (error) {
        expect(error.status).toEqual(400);
    }

});

test("Bad Password Test", async () => {

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
        expect(error.status).toEqual(400);
    }

});

test("Inconsistent Confirm Password Test", async () => {

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
        expect(error.status).toEqual(400);
    }

});

test("Bad Email Test", async () => {

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
        expect(error.status).toEqual(400);
    }

});

test("Missing Fields Test", async () => {

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
        expect(error.status).toEqual(400);
    }

});

test("Success Test", async () => {

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

});
