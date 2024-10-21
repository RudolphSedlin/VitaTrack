import { userData } from "../data/index.js";
import {expect, jest, test} from '@jest/globals';

test("Registration and Login Test", async () => {
    const Franklin = {
        firstName: "Test",
        lastName: "User",
        phoneNumber: "1-800-999-9997",
        state: "NY",

        address: "Mount Marcy",
        gender: "Yeti",
        dateOfBirth: "1970-01-01",
        doctorName: "Doctor Frankenstein",
        conditions: ["Zombism", "Social Isolation", "Super Strength", "Super Intelligence"],
        consentLetter: "I pledge allegiance to the flag of the United States of America, and to the Republic for which it stands, one nation, under god, indivisible, with liberty, and justice for all.", // Also stored for RPM customers.

        email: "BeeMail@bees.org", // Completely optional.
    };

    let registered = await userData.create(
        "Test",
        "User",
        "1-800-999-9997",
        "NY",
        "SamplePassWord12345+",

        "Mount Marcy",
        "Yeti",
        "1970-01-01",
        "Doctor Frankenstein",
        ["Zombism", "Social Isolation", "Super Strength", "Super Intelligence"],
        "I pledge allegiance to the flag of the United States of America, and to the Republic for which it stands, one nation, under god, indivisible, with liberty, and justice for all.",

        "BeeMail@bees.org",
    );

    let loggedIn = await userData.loginUser(
        "1-800-999-9997",
        "SamplePassWord12345+"
    );

    expect(loggedIn).toMatchObject(Franklin);
});
