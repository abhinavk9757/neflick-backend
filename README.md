# neflick-backend
Backend API for neflick

1. Create a **.env** file inside the root folder and 
    add your mongoDB uri as:

    **MONGO_URI = YOUR_MONGO_DB_ACCESS_URI_HERE**

    **SECRET_KEY = YOUR_SECRET_KEY_HERE**

2. Run **npm install** or **yarn**

3. Run **npm start** or **yarn start**

Following routes are established:
1. **POST /users** => Register a new user.
Requires **email** and **password** in JSON format
Returns **email** and **_id** of the newly created user and generated authentication token in the header as **x-auth**.
2. **POST /users/login** => Log in with an existing username and password.
Requires **email** and **password** in JSON format.
Returns **email** and **_id** of the existing user and generated authentication token in the header as **x-auth**.
3. **GET /users/me** => View details of currently logged-in user.
Requires authentication token in header with the key as **x-auth** and value as the token value.
Returns **email** and **_id** of user.
4. **DELETE /users/logout** => Log out the currently logged user
Requires authentication token in header with the key as **x-auth** and value as the token value.
Returns a response with status code of **200** on success and **400** on token validation failure.
