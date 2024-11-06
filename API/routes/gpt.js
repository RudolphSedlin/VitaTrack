import { Router } from "express";
import { userData } from "../data/index.js";
import validation from "../validation.js";
//import { image } from "../resources/sampleImage.js";
import { prompt } from "../resources/prompt.js";
const router = Router();

const MODEL = "gpt-4o";
const OPENAI_API_KEY = "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";
const TEMPERATURE = 0.1;
const MAX_TOKENS = 10000;

router
.route("/")
.post(async (req, res) => {
    if ( true ) { // req.session.user) {

    req.session.user = {
        "_id": "672bd0ffd57e19c400099a53",
        "firstName": "Ben",
        "lastName": "Franklin",
        "phoneNumber": "1-800-999-9999",
        "state": "NY",
        "meals": [
            "672bd0ffd57e19c400099a55",
            "672bd0ffd57e19c400099a56"
        ],
        "address": "Mount Marcy",
        "gender": "Monster",
        "dateOfBirth": "1970-01-01",
        "doctorName": "Doctor Frankenstein",
        "conditions": [
            "Zombism",
            "Social Isolation",
            "Super Strength",
            "Super Intelligence"
        ],
        "consentLetter": "I pledge allegiance to the flag of the United States of America, and to the Republic for which it stands, one nation, under god, indivisible, with liberty, and justice for all.",
        "email": "BeeMail@bees.org",
        "height": 80,
        "weight": 220,
        "allergies": null,
        "intolerances": null
    };


        let body = req.body;
        body = validation.sanitize(body);

        console.log(body);
        let image = body.image;

        //Send request with prompt to api
        const requestBody = {
            model: MODEL,
            messages: [
                { role: "system", content: "You are a nutritionist." },
            { role: "user", content: [
                {type: "text", text:prompt},
            {type: "image_url","image_url": {"url": `data:image/jpeg;base64,${image}`
            }}
            ]}
            ],
            max_tokens: MAX_TOKENS,
            temperature: TEMPERATURE
        };

        //Retrieve response from gpt
        const result = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify(requestBody)
        });

        const json = await result.json();
        const gptResponse = json.choices?.[0]?.message?.content?.trim() || 'No response.';
        console.log(gptResponse);
        return res.status(200).json(gptResponse);
    }

    return res.status(403).send("Not authenticated!");

})
;

export default router;
