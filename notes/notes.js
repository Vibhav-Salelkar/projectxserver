/*
Complete Documentation of ProjectX:

Setup and Concepts:
- init: npm init
- express: npm i express
- create app.js file
- import and create express instance (app)
- listen on port 3000
- create a route using use method of app
- install nodemon: to automatically restart server on changes
- nodemon: npm i nodemon
- run using nodemon: 
    - nodemon src/app.js
    - add script in package.json
        - "dev": "nodemon src/app.js"
        - npm run dev
- Concepts:
- caret sign in package.json (^4.19.2): automatically update if any new version of minor or patch comes in 4:x:x
- tilda sign in package.json (~4.19.2): automatically update if any new version of patch comes in 4.19.x
- no sign (4.19.2): only install this version
- versioning format: x:y:z  major:minor:patch 
    - patch: small change, bugfix, safe to install
    - minor: new features, backward compatible, safe to install without breaking things
    - major: when there are breaking changes


Routing and Request Handling:
- app.use: to create a route
- install postman or bruno to test the routes
    - create collection and scripts to test routes
- use app.get: to create a route for GET request
- use app.post: to create a route for POST request
- use app.put: to create a route for PUT request
- use app.delete: to create a route for DELETE request
- query params: ?key=value&key2=value2 can be used to pass data in the URL
    - can be accessed using req.query
- params: /user/:userId/:name/:pass can be used to pass data in the URL
    - can be accessed using req.params
- Concepts:
- advanced route operations like ?, + , () etc. are not supported in express 5
    - /us*er changed to /us{*splat}er
    - /use?r changed to /us{e}r
    - eg. /user/:userId{/:name}/:pass
- in case of app.use, placement order of route matters, if you have a route /home and /
    - if you place /home first, it will match first and not go to /
    - if you place / first, it will match first and not go to /home: even when you request /home
- if you use app.use it will execute as soon as it matches the route, rest all routes below will be ignored even if it exactly matches
    - eg. app.use(/home) on top will ignore all other routes below it
    - if we have app.get(/home/something) below, when you request /home/something it will not go to get route because it matches /home in app.use on top of it


Middlewares and Error Handlers:
- create app.get/post/delete/patch for different routes
- add multiple callback functions (handlers) for a single route 
    - play with it by calling/not calling next() in the handlers
    - sending response in the handlers multiple times or none times
    - calling next() in the last handler
    - wrapping in array and grouping the callback functions in array
- create multiple app.get/post/delete/patch for the same route and observe above patterns this way as well
- create app.use on top to match the routes, to check authorization of user - middleware concepts
- create middleware folder and auth.js file, export the middleware function from that
    - import it in app.js and use it as a handler in single route or 
    - use in app.use on top to check authorization for all routes
- at the bottom call app.use with / route and have err as first param (always) 
    - this captures the error in any of the routes above due to any reason, like db, code error, everything will be catched here
    - throw 500 error
- Concepts:
- when using app.use or app.get or any other, there can be multiple handlers for a single route, edge cases to consider:
    - first cb fn (handler) will execute and then next cb fn (handler) will execute, this will go on till the end
    - next handler will executle only if we call next() in the previous handler
    - sending response in any of these is mandatory, otherise it will keep on loading when we hit the url route
    - if we call next() in last handler, and there is no next handler, it will throw an error, it is same as not handling the request for that route
    - sending response and then calling next() or calling next() and then sending response from next handler and again coming back to the first handler to send response is again error
    - you cant send response from multiple handlers, it will throw an error, once sent it is done
- handlers can be stored in array, it can be also grouped in a separate arrays as shown below:
    - eg. app.get("/user", [handler1, handler2, handler3])
    - eg. app.get("/user", [handler1, [handler2, handler3]])
    - eg. app.get("/user", [handler1, handler2], handler3)
- instead of many handlers in same getter, we can also have multiple get, post etc. methods for the same route, they will be called in order by next()
- middleware: function that has access to the request object (req), the response object (res), and the next middleware function in the application’s request-response cycle
    - can be used to modify the request and response objects, end the request-response cycle, or call the next middleware function in the stack
    - can be used to log the request, authenticate the user, validate the request body, etc.
- suppose you want to validate whether user making request is authorized or not ON EVERY ROUTE, then instead of writing the same code in every route, we can create a middleware and before going in every route
    - req.body.token is one way to check if user is authorized or not
- what to use for middleware:
    - app.use: to create a middleware
        - this will be called for every request that matches the route
        - for example there are 3 routes /admin/getalldata, /admin/deleteuser, /admin/adddata
        - if you want to check if user is authorized for all these routes, you can create a middleware and use app.use("/admin", middleware)
        - so whenever any /admin/* route is called, it will first match app.use /admin on top and then by calling next() it will go to the next route
    - app.get/post/delete/patch: to create a route request
- you can also create a middleware in file and import and use it as handler if only one route needs it else use on top in app.use
- NOTE: if path is not given in app.use, it will be used for all the routes
- error handling: app.use with / can be used to catch all the errors in the routes above it
    - errors can be due to any reason in above routes and that will be caught here
    - should be placed at the end of all routes


Database, Schema & Models | Mongoose:
- create config folder and db.js file inside it
- install mongoose: npm i mongoose
- import mongoose in db.js and connect to the database using mongoose.connect and pass the connection string
- IMP: always listen to app port after connecting to the database is successful
    - why: because if db is not connected, we will not be able to perform any operations on it and app will start listening
    - so first connect to db and then start listening to the app
    - export connect function from db.js and import it in app.js and try callback write app listen code
- create models folder and create a file for each model: user.js
- import mongoose in user.js and create a schema using mongoose.Schema
- create a model using mongoose.model and pass the schema to it
- export the model from user.js and import it in app.js
- create route POST, create a new user object and save it to the database using user.save()
- since save is async, use try-catch block to handle errors


Diving into the APIs:
- data should be passed in the body of the request for POST, PUT, PATCH, DELETE requests
- use middleware express.json() to parse the body of the request
- you can access the body of the request using req.body
- create api to get user by emailId, delete user by id, get all users and update user by id
- id can be passed in the params of the request /user/:id and can be accessed using req.params.id
- for updating object sent from body, use req.body
- use findOne, findByIdAndDelete, findByIdAndUpdate, find to perform these operations
- always do transaction in try-catch block to handle errors


Data Sanitization and Schema Validation:
- add validation to the schema using required, unique, default, minLength, maxLength, min, max, lowercase, trim etc.
- add custom validation using validate: function() {}
- to run validation on update, use runValidators: true in the options of findByIdAndUpdate
- add {timestamps: true} to add createdAt and updatedAt fields to the schema automatically, as second param in mongoose.Schema
- data sanitization: to remove unwanted data from the request body before saving it to the database
    - write js logic, array will store what all is allowed and you run through req body and check if it is in the array or not
    - if not, throw error
    - needed while writing something to database
- use validator library to validate the data before saving it to the database or in Schema fields


Encrypting Passwords:
- create validation folder and validation.js file
- import validator in validation.js and create a function to validate the data
    - validate email, password using library, also use conditional statements to check if the data is valid or not
    - export the function and import it in app.js
- in route handler, always use try-catch block to handle errors
- use the valiation function on req, eg. validateSignup(req)
- install bcrypt: npm i bcrypt
- import bcrypt in app.js and use it to hash the password before saving it to the database
    - eg. const hashedPassword = await bcrypt.hash(req.body.password, 10);
- create login route and handler
- use bcrypt to compare the password entered by the user with the hashed password in the database
    - eg. const isMatch = await bcrypt.compare(password, user.password);
    - find user by email using findOne and then compare the hashed password of that user with the entered password
- never reveal specific information about the error, always send generic error message
    - eg. "Invalid email or password" instead of "User not found" or "Password is incorrect"


Authentication, JWT and Cookies:
- install jsonwebtoken: npm i jsonwebtoken
- install cookie-parser: npm i cookie-parser
- import jsonwebtoken and cookie-parser in app.js
- use cookie-parser as middleware in app.js
    - app.use(cookieParser());
- create a login route and handler
- in the login route, after verifying the user, create a JWT token using jsonwebtoken
    - eg. const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
- send the token in the response as a cookie using res.cookie
    - eg. res.cookie("token", token, { httpOnly: true });
- in the cookie, set httpOnly to true to prevent client-side access to the cookie
- access the cookie in the request using req.cookies
    - eg. const token = req.cookies.token;
- verify the token using jsonwebtoken in the middleware
    - eg. const decoded = jwt.verify(token, process.env.JWT_SECRET);
- create a middleware to check if the user is authenticated or not
    - isAuth can be middleware
    - just pass it in the route handler as a second param
    - middleware will check if the user is authenticated or not and set req.user to the user object
- create a function in userSchema to create a JWT token and send it in the response
- create a function in userSchema to verify the password
- make sure you dont use arrow functions in the schema methods, use regular function instead
Concepts:
- user logs in using /login route:
    - username and password are sent in the body of the request, are verified by the server using bcrypt
    - if verified, a JWT token is generated using jsonwebtoken library
    - the token is sent in the response as a cookie
    - the cookie is stored in the browser and sent with every request to the server
    - the server verifies the token using jsonwebtoken library and checks if the user is authorized to access the route
- since we want to reuse the code to verify the token in every route, we create a middleware
    - just pass it in the route handler as a second param
- IMP: all above code works fine, but we can offload the token creation, password verification to userScheama:
    - why, because first, it is related to user
    - second, we can use this in other places as well
    - this is best practice to keep the code clean and reusable


Diving into API and Router:
- decide and design the API
- create a file for each route paths, in routes folder
- use express.Router() to create a router
- import routes in app.js and use it as middleware
- use app.use("/api/v1", routes) to use the routes 
- create a route for logout
Concepts:
- APIs:
    - authRouter
        - /signup
        - /login
        - /logout
    - connectionsRouter
        - /request/send/interested/:userId
        - /request/send/ignored/:userId
        - /request/review/accepted/:userId
        - /request/review/rejected/:userId
    - profileRouter
        - /profile/view
        - /profile/edit
        - /profile/password
    - userRouter
        - /user/feed
        - /user/connections
        - /user/requests


Logical DB Query and Compound Indexes:
- to store connections data, create connections schema
- create fromUserId and toUserId, status in the schema
- learn and implement pre hooks on the schema
- learn about indexes and compound indexes and implement in schema
- add validations, enum and enum message errors
- in route handler, handle all the edge cases of connections
    - from and to userId should not be same - in pre hook
    - from and to userId should not be same as already present in the database - reverse as well
    - to userId should be in the database
- use same route for interested and ignored, just change have the dynamic status parameter in url
- Concepts:
- compound index: when we have multiple fields in the query, we can create a compound index on those fields to speed up the query
    - eg. if we have fromUserId and toUserId in the query, we can create a compound index on these two fields
    - this will speed up the query when we search for these two fields together, in millions of records
- single index: when we have only one field in the query, we can create a single index on that field
    - eg. userSchema.index({ email: 1 });
    - eg. connectionsSchema.index({ fromUserId: 1, toUserId: 1 });
    

Ref, Populate and API:
- create api to review connection requests
- use the same route for accepted and rejected, just change have the dynamic status parameter in url
- add corner cases in the route handler
- define ref in connection schema, it is like relationship between two schemas
- use populate to get the data from the other schema while calling the model in routehandler we can populate the data
- create connections and requests received GET routes for user 
- return the requests and connections based on conditional queries
- validate the coirner cases and populate the data


Building the Feed and Pagination:
- create feed api to get the users 
- user should be himself and not in the connections
- write complex aggregation query to get the users by first getting users connection data
- limit the number of users using pagination
- for pagination use queries in url, page=1 and limit=10 for example
- use skip and limit in the query to get the data
- skip will skip the number of records given in the query
    - eg. if page=2 and limit=10, skip = (2-1)*10 = 10
    - first 10 skipped and next 10 will be returned that is 11-20
- limit will limit the number of records returned


Secure Credentials using dotenv:
- npm install dotenv
- in app.js on top: require("dotenv").config()
- create .env file
- add constant and secret values there
- use it in code like eg. process.env.keyName
- deploy to server, and create .env file on server repo that you cloned similar way
    - sudo nano .env
    - paste your keys
- IMP NOTE: this process dotenv cannot be used in React frontend, as browser doesnt know process, env etc.


Sending Email using SES:
- create IAM user in aws console site
    - give it full access to ses amazonsesfullaccess checkbox
- go to created iam user's security information
    - create access key, copy access key and secret and add in .env
- go to amazon ses identities and create identity:
    - verify domain if any
    - else choose and verify email address
    - request for production ses access, if domain is there and verified
- go to AWS sdk V3 (v3 is latest and v2 is old but popular as already in use)
    - https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/javascript_ses_code_examples.html
    - https://github.com/awsdocs/aws-doc-sdk-examples/tree/main/javascriptv3/example_code/ses#code-examples
- open github link above
    - go to src and ses_sendemail.js file to get template code
    - this imports lib/sesClient.js, so do same way in our project
        - you should pass iam user credentials to SESClient, this is not there in docs
    - install @aws-sdk/client-ses
    - in template fill the html, text, subject as you need
    - also pass to and from email id's
    - now import this in connections route
        - after sending connection request logic
        - call this run method of sendEmail, eg. await sendEmail.run()
        - this will then send email to the to address from the address given
        - you can also pass params to run from connections logic, by sending dynamic params
    - NOTE: emails should be verified both to and from to work in sandbox environment


Scheduling Cron Jobs:
- install node-cron package
- import and see how cron job works by calling given template in docs
- install date-fns package, to get the day, date, time as you want
- now schedule the sending email to users based on the interested requests they received previous day
- for that import connection model to find the users using created timestamp and date-fns
- import sendEmail function and from above step get all email ids of to-users and send them emails
- specify time you want and for testing schedule for next min and day sub as 0, means today


Web Sockets and socket.io:
- web sockets, bidirectional, both client and server send data to each other
- event based communication between client and server
- low latency
- go to documentation of socket.io server
- install socket.io: npm i socket.io
- little diff configuration for express app
    - create server using const server = http.createServer(app) and then pass it to socket.io
    - listen to the server instead of app
- pass server to socket from socket.io along with config object for cors, store it in io variable
- use this io's on method to get socket when "connection" event is emitted
- use custom events like "joinChat", "sendMessage" to listen to the events from client
- client will emit event lets say "joinChat" with data like userId and targetUserId
- server will listen to this event and join the socket to a room using socket.join(roomId)
- roomId can be created using userId and targetUserId, like [userId, targetUserId].sort().join("_") through crypto hash
- if roomId is same, then both users will be in the same room and can communicate with each other
- listen to "sendMessage" event from client and emit "messageReceived" event to the room with the message data

More on Web Sockets:

























*/
