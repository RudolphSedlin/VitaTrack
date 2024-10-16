# Running the API:

***npm install***

Start MongoDB service however you are supposed to on your system.

Typically, this means querying your package manager for an implementation and calling the system service manager.
npm start

--------------------------------------------------------------------------------------

# ENDPOINTS:



## POST /register:

req.body should be a JS object with the following fields and string values:

  // Mandatory fields
  
  *firstname,*
  
  *lastname,*
  
  *phonenumber,*
  
  *state,*
  
  *password,*

  // Optional fields primarily for RPM customers.
  
  *address,*
  
  *gender,*
  
  *dateOfBirth,* // Should be formatted YYYY-MM-DD. I may remove this limitation later.
  
  *doctorName,*
  
  *conditions,*
  
  *consentLetter,*

  *email,* // Completely optional. Validated on the server.

Authenticates and redirects to /users if successful.

Authentication lasts for 1 hour before needing to be redone. May change duration later.

---------------------------------------------------------------------------------------

## POST /login:

Same as register, with the following fields:

  *phonenumer,*
  
  *password,*

Authenticates and redirects to /users if successful.

Authentication lasts for 1 hour before needing to be redone. May change duration later.

-------------------------------------------------------------------------------------

## GET /users:

Must be authenticated first, see above.

Server returns a JSON of the user if successful, and an {error: ERROR} JSON otherwise.

------------------------------------------------------------------------------------

## GET /meals:

Must be authenticated first, see above.

Returns an expanded list of all user meals as JSON.

----------------------------------------------------------------------------------------

## POST /meals:

Must be authenticated first, see above.

Also as above, please submit a JSON in req.body as such

  *name,*
  
  *description,*

Returns a JSON of the created meal.

------------------------------------------------------------------------------------------

## GET /meals/:id:

Must be authenticated first, see above.

Returns an expanded JSON of the specified meal.

-------------------------------------------------------------------------------------------

## GET /logout:

Must be authenticated first, see above.

Logs out.
