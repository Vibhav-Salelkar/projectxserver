const express = require('express');

# ProjectX Documentation

## Setup and Concepts

### Initial Setup

- **Initialize Project:**  
    `npm init`
- **Install Express:**  
    `npm i express`
- **Create Entry File:**  
    Create `app.js`
- **Import and Create Express Instance:**  
    ```js
    const app = express();
    ```
- **Start Server:**  
    ```js
    app.listen(3000, () => {
        console.log('Server running on port 3000');
    });
    ```
- **Create a Route:**  
    Use the `use` method of `app`.

### Development Tools

- **Install Nodemon:**  
    Automatically restarts server on changes.  
    `npm i nodemon`
- **Run with Nodemon:**  
    - `nodemon src/app.js`
    - Add script in `package.json`:
        ```json
        "scripts": {
            "dev": "nodemon src/app.js"
        }
        ```
    - Run: `npm run dev`

### Versioning Concepts

- **Caret (`^4.19.2`):** Updates to new minor/patch versions in 4.x.x.
- **Tilde (`~4.19.2`):** Updates to new patch versions in 4.19.x.
- **No Sign (`4.19.2`):** Installs only this version.
- **Version Format:**  
    `major.minor.patch`
    - **Patch:** Small change, bugfix, safe to install.
    - **Minor:** New features, backward compatible.
    - **Major:** Breaking changes.

---

## Routing and Request Handling

### Creating Routes

- **General Route:**  
    `app.use()`
- **GET Route:**  
    `app.get()`
- **POST Route:**  
    `app.post()`
- **PUT Route:**  
    `app.put()`
- **DELETE Route:**  
    `app.delete()`

### Testing Routes

- Use [Postman](https://www.postman.com/) or [Bruno](https://www.usebruno.com/) to test routes.
- Create collections and scripts to test routes.

### Passing Data

- **Query Params:**  
    `?key=value&key2=value2`  
    Access with `req.query`
- **Route Params:**  
    `/user/:userId/:name/:pass`  
    Access with `req.params`

### Advanced Routing Concepts

- **Express 5 Route Patterns:**  
    - Advanced operations like `?`, `+`, `()` are not supported.
    - `/us*er` → `/us{*splat}er`
    - `/use?r` → `/us{e}r`
    - Example: `/user/:userId{/:name}/:pass`

- **Route Placement Order:**
    - Order matters in `app.use`.
    - If `/home` is above `/`, `/home` matches first.
    - If `/` is above `/home`, `/` matches all, including `/home`.

- **Route Matching with `app.use`:**
    - Executes as soon as it matches the route; ignores routes below.
    - Example:  
        If `app.use('/home')` is on top, all `/home` routes below are ignored.
        If `app.get('/home/something')` is below, it won't be reached if `/home` matches first.


## Middlewares and Error Handlers

- **Create Route Handlers:**  
    Use `app.get`, `app.post`, `app.delete`, or `app.patch` for different routes.

- **Multiple Callback Functions (Handlers) for a Single Route:**  
    - You can pass multiple callback functions to a route.
    - Experiment by calling or not calling `next()` in handlers.
    - Observe what happens if you send a response multiple times or not at all.
    - Try calling `next()` in the last handler.
    - Handlers can be grouped in arrays and passed as such.

- **Multiple Routes for the Same Path:**  
    - Define multiple `app.get`, `app.post`, etc., for the same route and observe how handlers and `next()` work.

- **Middleware for Authorization:**  
    - Use `app.use` at the top to match routes and check user authorization.
    - Create a `middleware` folder and an `auth.js` file to export your middleware function.
    - Import it in `app.js` and use it as a handler for a single route or with `app.use` to protect all routes.
    - *NOTE*: if path is not given in app.use, it will be used for all the routes


- **Error Handling Middleware:**  
    - At the bottom, use `app.use('/', ...)` with an error handler (first parameter is `err`).
    - This captures errors from any route above, such as database or code errors.
    - Typically, send a 500 error response here.

### Concepts and Edge Cases

- Multiple handlers can be used with `app.use`, `app.get`, etc.:
    - Each handler executes in order if `next()` is called.
    - If `next()` is not called, the next handler will not execute.
    - A response must be sent in one of the handlers; otherwise, the request will hang.
    - Calling `next()` in the last handler without another handler results in an error (unhandled request).
    - Sending a response and then calling `next()`, or sending multiple responses, will cause errors.

- **Grouping Handlers:**
    - Handlers can be stored in arrays or nested arrays:
        ```js
        app.get("/user", [handler1, handler2, handler3]);
        app.get("/user", [handler1, [handler2, handler3]]);
        app.get("/user", [handler1, handler2], handler3);
        ```

- **Multiple Methods for the Same Route:**
    - You can define multiple `get`, `post`, etc., for the same route; they are called in order with `next()`.

- **Middleware Definition:**
    - Middleware functions have access to `req`, `res`, and `next`.
    - They can modify `req`/`res`, end the cycle, or call `next()` to continue.
    - Use cases: logging, authentication, validation, etc.

- **Global Middleware Example:**
    - To validate authorization on every route, create a middleware and use `app.use`:
        ```js
        app.use(middleware);
        ```
    - For specific routes, use `app.use("/admin", middleware)` to protect all `/admin/*` routes.

- **Importing Middleware:**
    - Create middleware in a separate file and import it for use in specific routes or globally.

- **Error Handling Middleware:**
    - Place an error handler at the end using `app.use` with an error parameter:
        ```js
        app.use((err, req, res, next) => {
            if(err) res.status(500).send('Internal Server Error');
        });
        ```
    - This will catch errors from any route above.


## Database, Schema & Models with Mongoose

### Setup

- **Create Config Folder:**  
    Create a `config` folder and a `db.js` file inside it.

- **Install Mongoose:**  
    ```bash
    npm i mongoose
    ```

- **Database Connection:**  
    - Import `mongoose` in `db.js`.
    - Connect to the database using `mongoose.connect` and provide the connection string.
    - **Important:** Always start the app server **after** a successful database connection.
        - **Reason:** If the database is not connected, the app should not start listening, as database operations would fail.
        - First connect to the database, then start the server.
    - Export the connect function from `db.js`.
    - Import it in `app.js` and, in the callback, write the code to start the server (e.g., `app.listen`).

### Models

- **Create Models Folder:**  
    Create a `models` folder and a separate file for each model, e.g., `user.js`.

- **Define Schema and Model:**  
    - Import `mongoose` in `user.js`.
    - Create a schema using `mongoose.Schema`.
    - Create a model using `mongoose.model` and pass the schema to it.
    - Export the model from `user.js`.

- **Use Model in App:**  
    - Import the model in `app.js`.
    - Create a POST route to create a new user object and save it to the database using `user.save()`.
    - Since `save` is asynchronous, use a `try-catch` block to handle errors.

## Diving into the APIs

- Data should be passed in the body of the request for POST, PUT, PATCH, DELETE requests.
- Use middleware `express.json()` to parse the body of the request.
- You can access the body of the request using `req.body`.
- Create API to get user by emailId, delete user by id, get all users and update user by id.
- Id can be passed in the params of the request `/user/:id` and can be accessed using `req.params.id`.
- For updating object sent from body, use `req.body`.
- Use `findOne`, `findByIdAndDelete`, `findByIdAndUpdate`, `find` to perform these operations.
- Always do transaction in try-catch block to handle errors.

### Data Sanitization and Schema Validation

- Add validation to the schema using options like `required`, `unique`, `default`, `minLength`, `maxLength`, `min`, `max`, `lowercase`, `trim`, etc.
- Implement custom validation with the `validate` property in schema fields.
- To run validation on updates, use `runValidators: true` in the options of `findByIdAndUpdate`.
- Add `{ timestamps: true }` as the second parameter in `mongoose.Schema` to automatically include `createdAt` and `updatedAt` fields.
- For data sanitization, filter the request body to only allow specific fields before saving to the database. Maintain an array of allowed fields and check each property in the request body against this array. If a property is not allowed, throw an error.
- Use the `validator` library to validate data before saving it to the database or within schema fields.


### Encrypting Passwords

- **Create Validation Logic:**
    - Make a `validation` folder and `validation.js` file.
    - Import the `validator` library and write functions to validate email and password.
    - Use conditional checks for validity.
    - Export the validation function and import it in `app.js`.
    - In route handlers, always use a try-catch block.
    - Use the validation function on requests, e.g. `validateSignup(req)`.

- **Hash Passwords:**
    - Install bcrypt: `npm i bcrypt`
    - Import bcrypt in your handler file.
    - Hash passwords before saving:
        ```js
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        ```

- **Login and Password Comparison:**
    - Create a login route and handler.
    - Find user by email using `findOne`.
    - Compare entered password with stored hash:
        ```js
        const isMatch = await bcrypt.compare(password, user.password);
        ```

- **Security Best Practices:**
    - Always send generic error messages (e.g., "Invalid email or password") instead of revealing details.


    ## Authentication, JWT, and Cookies

    - **Install Dependencies:**
        - `npm i jsonwebtoken`
        - `npm i cookie-parser`
    - **Import in `app.js`:**
        - Import `jsonwebtoken` and `cookie-parser`.
        - Use cookie-parser middleware:  
          `app.use(cookieParser());`
    - **Login Route:**
        - After verifying the user, create a JWT token:  
          ```js
          const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
          ```
        - Send the token as a cookie:  
          ```js
          res.cookie("token", token, { httpOnly: true });
          ```
        - Setting `httpOnly: true` prevents client-side access to the cookie.
    - **Accessing and Verifying Token:**
        - Access the cookie in requests:  
          `const token = req.cookies.token;`
        - Verify the token in middleware:  
          `const decoded = jwt.verify(token, process.env.JWT_SECRET);`
    - **Authentication Middleware:**
        - Create a middleware (e.g., `isAuth`) to check authentication.
        - Pass it as a second parameter in route handlers.
        - Middleware checks authentication and sets `req.user`.
    - **Schema Methods:**
        - Add a method in `userSchema` to create JWT tokens and send in response.
        - Add a method in `userSchema` to verify passwords.
        - Use regular functions (not arrow functions) in schema methods.

    **Concepts:**

    - User logs in via `/login` route:
        - Username and password are sent in the request body and verified using bcrypt.
        - If verified, a JWT token is generated and sent as a cookie.
        - The cookie is stored in the browser and sent with every request.
        - The server verifies the token and checks authorization.
    - Middleware is used to verify the token on protected routes.
    - Offload token creation and password verification to `userSchema` for reusability and clean code.

    ---

    ## Diving into API and Router

    - **API Design:**
        - Create a file for each route path in the `routes` folder.
        - Use `express.Router()` to create routers.
        - Import routes in `app.js` and use as middleware.
        - Use `app.use("/api/v1", routes)` to mount routes.
        - Create a logout route.

    **API Structure:**

    - `authRouter`
        - `/signup`
        - `/login`
        - `/logout`
    - `connectionsRouter`
        - `/request/send/interested/:userId`
        - `/request/send/ignored/:userId`
        - `/request/review/accepted/:userId`
        - `/request/review/rejected/:userId`
    - `profileRouter`
        - `/profile/view`
        - `/profile/edit`
        - `/profile/password`
    - `userRouter`
        - `/user/feed`
        - `/user/connections`
        - `/user/requests`

    ---

    ## Logical DB Query and Compound Indexes

    - **Connections Schema:**
        - Create `fromUserId`, `toUserId`, and `status` fields.
        - Implement pre hooks for validation.
        - Add indexes and compound indexes for efficient queries.
        - Add validations, enums, and custom error messages.
    - **Edge Cases in Handlers:**
        - `fromUserId` and `toUserId` should not be the same (check in pre hook).
        - Prevent duplicate connections (including reverse).
        - Ensure `toUserId` exists in the database.
        - Use dynamic status parameter in routes for interested/ignored.

    **Concepts:**

    - **Compound Index:** For queries involving multiple fields (e.g., `fromUserId` and `toUserId`), create a compound index to speed up queries.
        - Example: `connectionsSchema.index({ fromUserId: 1, toUserId: 1 });`
    - **Single Index:** For queries on a single field (e.g., `email`), create a single index.
        - Example: `userSchema.index({ email: 1 });`

    ---

    ## Ref, Populate, and API

    - **Review Connection Requests:**
        - Use the same route for accepted/rejected with dynamic status in the URL.
        - Handle corner cases in the route handler.
    - **Schema Relationships:**
        - Define `ref` in connection schema to relate schemas.
        - Use `populate` to fetch related data in route handlers.
    - **User Connections and Requests:**
        - Create GET routes for connections and requests.
        - Return data based on conditional queries.
        - Validate edge cases and use `populate` for related data.

    ---

    ## Building the Feed and Pagination

    - **Feed API:**
        - Create an API to get users for the feed.
        - Exclude the current user and their connections.
        - Use aggregation queries to fetch users based on connection data.
    - **Pagination:**
        - Limit users returned using pagination.
        - Use query parameters: `page=1`, `limit=10`.
        - Use `skip` and `limit` in queries:
            - `skip = (page - 1) * limit`
            - Example: For `page=2` and `limit=10`, skip 10 and return next 10 (users 11-20).

