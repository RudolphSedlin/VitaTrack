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

// Check routes by error codes. Bad routes 404, but other routes will 400 or 403 due to bad requests.

test("Login Test", async () => {

    try {
        await client.post('http://localhost:3000/login',
                         {
                         }
        )
    }
    catch (error) {
        expect(error.status).toEqual(400);
    }

}, 30000);

test("Register Test", async () => {

    try {
        await client.post('http://localhost:3000/register',
                         {
                         }
        )
    }
    catch (error) {
        expect(error.status).toEqual(400);
    }

}, 30000);

test("User Test", async () => {

    try {
        await client.get('http://localhost:3000/user',
                         {
                         }
        )
    }
    catch (error) {
        expect(error.status).toEqual(403);
    }

}, 30000);

test("Meals Test", async () => {

    try {
        await client.get('http://localhost:3000/meals',
                        {
                        }
        )
    }
    catch (error) {
        expect(error.status).toEqual(403);
    }

}, 30000);

test("Logout Test", async () => {

    try {
        await client.get('http://localhost:3000/logout',
                        {
                        }
        )
    }
    catch (error) {
        expect(error.status).toEqual(403);
    }

}, 30000);

test("Random Fail Test", async () => {

    try {
        await client.get(`http://localhost:3000/${crypto.randomBytes(16).toString('hex')}`,
                        {
                        }
        )
    }
    catch (error) {
        expect(error.status).toEqual(404);
    }

}, 30000);
