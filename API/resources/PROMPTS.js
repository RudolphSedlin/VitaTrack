export const NUTRIENT_PROMPT = `Identify, the food in the image, and return ONLY a JSON object for the estimated per-serving nutrient data
of the food in the image. You do not have to be 100% accurate, however, you
cannot provide a range for each value you must pick an exact value for each.
You must follow in this format exactly, you must provide a value for each and
every item even if it is 0.0 grams. This means you can't leave out any carbohydrates,
proteins, fats, vitamins, or minerals {

    "name": "Spaghetti", // A string-valued name field for the identified foodstuff.

    "description": "A delicious mix of pasta, sauces and meats. A great source of proteins and carbohydrates, but also fats." // A string-valued description field for the identified foodstuff.

    "servings": 2.0, // Provide an estimate for the number of servings seen visually.

    "caloriesPerServing": 40.0, // This is the ONLY value that is not itself an object with gram-values, but rather standard kilocalory count PER SERVING.

    // To reiterate, the rest of these gram values are all PER SERVING! We will multiply by the serving count seperately.
    "carbohydrates": {

        "sugars": 0.0, // Grams as usual.

        "fiber": 0.0 // Grams as usual.

    },

    "nutrientsPerServing": {

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
