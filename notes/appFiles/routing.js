const express = require("express");

const app = express();

// see how using app.use will ignore the routes below it after just matching /user without carrying what is next slashes eg. /user/home
app.use("/user", (req, res) => {
    res.send("use route for user");
})

// go through new way of defining routes in express 5
app.get("/user/:userId{/:name}/:pass", (req, res) => {
    console.log(req.query);
    console.log(req.params);
    res.send("get user");
})

app.post("/user", (req, res) => {
    res.send("post user");
})

app.delete("/user", (req, res) => {
    res.send("delete user");
})

app.patch("/user", (req, res) => {
    res.send("patch user");
})

app.use("/home", (req, res) => {
    res.send("Hello home");
})

app.use("/", (req, res) => {
    res.send("Hello World");
})

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
