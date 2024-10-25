import { userData, mealData } from "../data/index.js";

let Franklin = await userData.create(
    "Ben",
    "Franklin",
    "1-800-999-9999",
    "NY",
    "SamplePassWord12345+",

    "Mount Marcy",
    "Monster",
    "1970-01-01",
    "Doctor Frankenstein",
    ["Zombism", "Social Isolation", "Super Strength", "Super Intelligence"],
    "I pledge allegiance to the flag of the United States of America, and to the Republic for which it stands, one nation, under god, indivisible, with liberty, and justice for all.",

    "BeeMail@bees.org",
    80,
    220,
);

let Jupiter = await userData.create(
    "Jupiter",
    "Ultor",
    "1-800-123-4567",
    "Greece",
    "GiantMagnet+318",

    "Mount Olympus",
    "Regal Deity",
    "1970-01-01",
    "Doctor Hygeia",
    [],
    "I consent to medical treatment.",

    "Jove@Parthenon.org",
    99,
    450,
);

let food = await mealData.create(
    "Cookies",
    "Nutritiously Terrible, But Delicious.",
    Franklin._id.toString()
);

console.log(food);

food = await mealData.create(
    "Kiwis",
    "A delectable snack, very healthy. Eat more of this please.",
    Franklin._id.toString()
);

console.log(food);

food = await mealData.create(
    "Ichor",
    "A devine honeylike snack that grants immortality..",
    Jupiter._id.toString()
);

console.log(food);

Jupiter = await userData.getUserByID(Jupiter._id.toString());

console.log(Jupiter);
console.log("Password: GiantMagnet+318");

Franklin = await userData.getUserByID(Franklin._id.toString());

console.log(Franklin);
console.log("Password: SamplePassWord12345+");

console.log("Done seeding, happy testing!");
