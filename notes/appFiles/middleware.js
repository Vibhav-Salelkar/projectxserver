const express = require("express");

const app = express();


// play around with the code below to understand the concepts
app.get("/user",
    (req, res, next) => {
        console.log("handler 1");
        next();
        // res.send("res1");
    },
    (req, res, next) => {
        console.log("handler 2");
        next();
        // res.send("res2");
    },
    (req, res, next) => {
        console.log("handler 3");
        // res.send("res3");
        next();
    },
    (req, res, next) => {
        console.log("handler 4");
        res.send("res4");
        // next();
    }
)

// grouping handlers in array
app.get("/admin",
    [
        (req, res, next) => {
            console.log("handler 1");
            next();
            // res.send("res1");
        },
        (req, res, next) => {
            console.log("handler 2");
            next();
            // res.send("res2");
        }
    ],
    (req, res, next) => {
        console.log("handler 3");
        // res.send("res3");
        next();
    },
    (req, res, next) => {
        console.log("handler 4");
        res.send("admin4");
        // next();
    }
)

//we can also have same methods with same route and it will be called in order by next()
app.get("/dev", (req, res, next) => {
    console.log("user1");
    // res.send("first user");
    next();
})

app.get("/dev", (req, res) => {
    console.log("user2");
    res.send("second user");
})


//middlewares
// can be placed in separate file and imported
const authCheck = function (req, res, next) {
    let token = "xz";
    let isAuthorized = token === "xyz";
    if (isAuthorized) {
        next();
    } else {
        res.status(401).send("Unauthorized");
    }
}

//auth middleware for all tester routes tester/* will pass through this
app.use("/tester", (req, res, next) => {
    let token = "xyz";
    let isAuthorized = token === "xyz";
    if (isAuthorized) {
        next();
    } else {
        res.status(401).send("Unauthorized");
    }
});

//only one route needs authCheck middleware
app.get("/main", authCheck, (req, res, next) => {
    console.log("main");
    res.send("main");
});

app.get("/tester/getData", (req, res, next) => {
    log("tester getData");
    res.send("tester getData");
})

app.get("/tester/error", (req, res, next) => {
    console.log("throwing error, should be catched by use at bottom");
    throw new Error("error");
    res.send("tester delete");
})

app.get("/tester/delete", (req, res, next) => {
    console.log("tester delete");
    res.send("tester delete");
})

//error handling - error due to any reason in the routes above will be caught here
app.use("/", (err, req, res, next) => {
    if (err) {
        res.status(500).send("something went wrong");
    }
});


app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
