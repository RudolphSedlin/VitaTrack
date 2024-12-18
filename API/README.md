# Running the API:

The API has been deployed to the remote production URI 
```ec2-18-234-48-168.compute-1.amazonaws.com```
meaning it is no longer necessary to deploy it locally for most testing. That being said, this is how it can be done:

1. From the project root directory, enter the API directory.

    ```bash
    cd API
    ```
    
2. Install node dependencies.

    ```bash
    npm install
    ```
    
3. Install MongoDB on the host machine. See the following common distributions for instructions. Unnamed distributions are likely to be derivatives of these common ones.

    Ubuntu/Debian:
    ```bash
    sudo apt update
    sudo apt install -y mongodb
    ```
    
    RHEL/CentOS/Fedora:
    ```bash
    sudo dnf install -y mongodb
    ```

    Arch Linux:
    ```bash
    sudo pacman -S mongodb
    ```
    
    OpenSUSE:
    ```bash
    sudo zypper install -y mongodb
    ```
    
    Gentoo:
    ```bash
    sudo emerge --ask dev-db/mongodb
    ```
    
    Alpine Linux:
    ```bash
    sudo apk add mongodb
    ```
    
4. Start the MongoDB service.

    On most systems (Ubuntu, Debian, Fedora, CentOS 7+, openSUSE, Arch Linux), ***systemctl*** is reponsible for service management.
    ```bash
    sudo systemctl start mongodb
    ```
    
    On certain older systems ***service*** is responsible for service management.
    ```bash
    sudo service mongodb start
    ```
    
    Respectfully for the above system configurations, the service can be checked for operation as such:
    ```bash
    sudo systemctl status mongodb
    ```
    ```bash
    sudo service mongodb status
    ```
    
5. ***OPTIONAL*** Enable MongoDB at boot.

    Respectfully for the above system configurations.
    ```bash
    sudo systemctl enable mongodb
    ```
    ```bash
    sudo chkconfig mongodb on
    ```
    
6. Start the server.

    ```bash
    npm start
    ```
    
7. ***OPTIONAL*** Run the tester.

    ```bash
    npm run test
    ```
    
    Run the cleaner afterwards, you may need to Ctrl+C (SIGINT) to exit it after it has run.
    ```bash
    npm run clean
    ```
    
8. ***OPTIONAL*** Run the seeder.

    ```bash
    npm run seed
    ```
    As above, run the cleaner afterwards.
    
9. **MAYBE NECESSARY** Allow traffic over port 3000. Many firewalls forbid public traffic over this port.

--------------------------------------------------------------------------------------

# Authentication:

Authentication lasts for 1 week before needing to be redone, with the exception of the server restarting, which intentionally breaks sessions for security reasons. 

The client is served a single persistent AuthState cookie, containing a hash of the session ID against a secret that regenerates when the server restarts.

To continue your session, please serve this cookie to the API. Otherwise, you will need to reauthenticate.

Authentication is also rolling, calling the API refreshes the alloted time.

--------------------------------------------------------------------------------------

# Objects:

Listed here are the output JSON objects of the API. so this is what the front-end will see. 

Fields are sorted by their necessity for various requests, unless stated otherwise in the route doc. 

Mandatory fields MUST be provided for POST requests in the request body. 

Optional fields can be absent from POST requests in the request body. If so, they will be null. 

Database fields are fields generated by the database and provided to the user for extram information, and need never be submitted.

## Users:

### Mandatory fields
  
  *firstName*: A string between 2 and 25 characters long.
  
  *lastName*: A string between 2 and 25 characters long.
  
  *phoneNumber*: Currently just a nonempty string. I will add a validator eventually. Use your imagination though, its a string. 
  
  *state*: A non-empty string.

### Optional fields primarily for RPM customers
  
  *address*: A non-empty string.
  
  *gender*: A non-empty string.
  
  *dateOfBirth*: A string formatted YYYY-MM-DD and set in the past. Yes, I check that it is past.
  
  *doctorName*: A non-empty string.
  
  *conditions*: An array of non-empty strings.
  
  *consentLetter*: A nonempty string.
  
### Completely optional. Validated on the server

  *email*: A string with typical email formatting of USER@DOMAIN.TLD 
  
  *height*: A number in inches between 30 and 100.
  
  *weight*: A positive number.

  *allergies*: A string array.

  *intolerances*: A string array.
  
### Database fields

  *_id*: A MongoDB object ID formatted as a string.
  
  *meals*: An array of meal objects, see docs.
  
## Meals:

### Mandatory fields
  
  *name*: A nonempty string.
  
### Optional but highly encouraged fields
  
  *description*: A nonempty string describing the meal. 
  
  *servings*: A positive number that describes the number of meal servings, likely entered by the user or inferred. That way, we can have seperate per/serving data for a more accurate representation, and query LLMs just for per-serving data, which will be accurate.
  
  *caloriesPerServing*: A non-negative number that describes the number of meal kilocalories for each serving.
  
  *nutrientsPerServing*: A JSON object describing the nutritional macro-composition of the meal for each serving. See the Nutrients object below.
  
### Database fields

  *_id*: A MongoDB object ID formatted as a string.
  
  *dateCreated*: A string showing the date and time the meal was added in UTC.
  
## Nutrients:

All fields are optional. That being said, if they are present, they should be formulated as such, with the keys specified below. That way, we have a common spec for how these should be interpreted. 

Note that for the sake of uniformity and unambiguity ***ALL*** numerical units are grams, and should be interpreted as such by the front-end or LLM.

We allow for primary fields that describe macronutrient categories (carbs, proteins, fats, vitamins, minerals, others), and subfields that describe them individually (note some LLMs really like to attach Totals as well, this will need to be prompted away). We can evaluate totals for each category with JS for-in loops, keeping implementation simple. That is to say, the object should be just two layers deep.

Remember also to call stringify on the client / LLM before attaching this to the request body. Otherwise, it will be cast to "[Object object]".
 
Please see this example object of a Chicken-Breast nutrient sheet for further unambiguity.
 
 {
 
      "carbohydrates": { // We can sum up all the subfield values with a for-in loop. That way, we can have both specificity and compactness in our objects.
      
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
      
        "cholesterol": 0.03 // Grams.
      
        // You get it at this point.
      
      }
      
    }

--------------------------------------------------------------------------------------

# Session Data:

The server stores a copy of the echoed user object as session data. For implementers, this field is express req.session.user.

--------------------------------------------------------------------------------------

# ENDPOINTS:

## POST /register:

The request body should should be a user object. In addition, please include the following fields in the object as well.

*password*: A string at least 8 characters long. Cannot contain spaces. Must contain a number, an uppercase letter, and a special character from the set "!@#$%^&*():<>?,.;/[]\\-=`~'\"+{}|".

*confirmPassword*: A string that should match the *password* string.

Registers and authenticates and returns a JSON of the user object.

## POST /login:

Unlike register, you need only provide the following fields, corresponding to their counterparts in the user object.

  *phoneNumber*
  
  *password*: See POST /register.

Authenticates and returns a JSON of the user object.

## GET /user:

Must be authenticated first, see above.

Server returns a JSON of the user object if successful, and an error otherwise.

## DELETE /user:

Must be authenticated first, see above.

Server deletes the user object for the current user session.

Logs out and ends the session.

## PUT /user:

The request body should should be a partial user object. That is to say, you need not provide all fields, only those worth updating. In addition, you may also update this field.

*password*: A string at least 8 characters long. Cannot contain spaces. Must contain a number, an uppercase letter, and a special character from the set "!@#$%^&*():<>?,.;/[]\\-=`~'\"+{}|".

Note that providing any fields not specified in the user object or here will throw an error, you should not submit brand new fields to an update function.

You may also not update the "meals" field, for obvious reasons. See the user object for restrictions on other field values.

Returns a JSON of the new user object, and updates the session accordingly.

## GET /logout:

Must be authenticated first, see above.

Logs out and ends the session.

## GET /meals:

Must be authenticated first, see above.

Returns an expanded list of all meal objects belonging to the user.

## POST /meals:

Must be authenticated first, see above.

Please submit the mandatory meal fields.

Returns a JSON of the created meal, and updates the session accordingly.

## POST /meals/image:

Must be authenticated first, see above.

Please submit a base-64 encode of an image. See TensorCamera.tsx and API/resources/IMAGES.js for examples.

Returns a JSON of the created meal, and updates the session accordingly.

## GET /meals/today:

Must be authenticated first, see above.

Returns an expanded list of all meal objects belonging to the user for the current day.

## GET /meals/recommendations:

Must be authenticated first, see above.

Returns a text from the LLM detailing a general dieting roadmap consisting of many general food items, taking into account specific fitness goals.

## GET /meals/alternatives:

Must be authenticated first, see above.

Returns a text from the LLM detailing specific foods that could work as superior alternatives to the existing foodstuffs.

## GET /meals/:id:

Must be authenticated first, see above.

Returns an expanded JSON of the meal specified in the id, assuming it belongs to the authenticated user.

## GET /meals/report:

Must be authenticated first, see above.

Returns an incredibly detailed JSON report of all the user's dieting habits. If I document how this report is arranged, these docs would bloat 10X. Rest assured, it is incredibly thorough.
