export const ALTERNATIVES_PROMPT = '`You need to provide dietary alternatives to existing food items to a user with the following information: ${user}, and the following recent meals: ${meals}. Note that you are talking to the user directly, so please address everything in the conversational first-person, rather than as a third person observer, but avoid a greeting, consider the user anonymous. When responding, stick to three specific food items (if so many are available, if there are none at all just state as much that you cant provide alternatives when a reference doesnt exist), cite them, and describe their alternatives and why they would be preferable. Of course, this means the alternatives need to be somehow comperable to the food items themselves, it is a useful but ultimately moot point for example to argue for greater vitamins when the user gorges on sweets.`';

export const RECOMMENDATIONS_PROMPT = '`You need to provide dietary recommendations to a user with the following information: ${user}, and the following recent meals: ${meals}. Note that you are talking to the user directly, so please address everything in the conversational first-person, rather than as a third person observer, but avoid a greeting, consider the user anonymous. When responding, stick to three specific food items that you could argue for and that the user could incorporate to achieve common fitness goals.`';

export const NUTRIENT_PROMPT = `Identify the food in the image, and return ONLY a JSON object for the estimated per-serving nutrient data
of the food in the image. You do not have to be 100% accurate, however, you
cannot provide a range for each value you must pick an exact value for each.
You must follow in this format exactly, you must provide a value for each and
every item even if it is 0.0 grams. This means you can't leave out any carbohydrates,
proteins, fats, vitamins, or minerals {

    "name": "Spaghetti", // A string-valued name field for the identified foodstuff.

    "description": "A delicious mix of pasta, sauces and meats. A great source of proteins and carbohydrates, but also fats." // A string-valued description field for the identified foodstuff.

    "servings": 2.0, // Provide an estimate for the number of servings seen visually.

    "caloriesPerServing": 40.0, // This is the ONLY value that is not itself an object with gram-values, but rather standard kilocalory count PER SERVING.

    "nutrientsPerServing": {

        // To reiterate, the rest of these gram values are all PER SERVING! We will multiply by the serving count seperately.
        "carbohydrates": {

            "sugars": 0.0, // Grams as usual.

            "fiber": 0.0 // Grams as usual.

        },

        "protein": {

            "total" 31.0, // Grams as usual.

        },

        "fats": { // Grams as usual.

            "saturated": 1.0, // Grams as usual.

            "monounsaturated": 1.2, // Grams as usual.

            "polyunsaturated": 0.8, // Grams as usual.

            "trans": 0.0 // Grams as usual.

        },

        "vitamins": { // Grams as usual

            "A": 0.0001, // Still grams despite the low value. Uniformity is more important.

            "B6": 0.0004, // Still grams despite the low value. Uniformity is more important.

            "B12": 0.0005 // Still grams despite the low value. Uniformity is more important.

            "C": 0.0003, // Still grams despite the low value. Uniformity is more important.

            "D": 0.0002, // Still grams despite the low value. Uniformity is more important.

            "E": 0.0009, // Still grams despite the low value. Uniformity is more important.

            "K": 0.008, // Still grams despite the low value. Uniformity is more important.
        },

        "minerals": { // Grams as usual

            "sodium": 0.074, // Still grams despite the low value. Uniformity is more important.

            "potassium": 0.256, // Still grams despite the low value. Uniformity is more important.

            "calcium": 0.015, // Still grams despite the low value. Uniformity is more important.

            "iron": 0.0009 // Still grams despite the low value. Uniformity is more important.

        },

        "other": {

            // You get it at this point.
            // Notably, consider cholesterols here, in grams as usual.

        }
    }

}`;
