const express = require("express");
const cookieParser = require("cookie-parser");

//chat, socket.io
const http = require("http");
const { initializeSocket } = require("./utils/socket.js");

const cors = require("cors");
require("dotenv").config();
require("./utils/cronJobs.js")

const { connectDB } = require("./config/db");
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const userRouter = require("./routes/user");
const connectionsRouter = require("./routes/connections");
const chatRouter = require("./routes/chat");

const app = express();

app.use(express.json()); // Middleware to parse JSON body
app.use(cookieParser()); // Middleware to parse cookies
app.use(cors({
    origin: "http://localhost:5173", // Replace with your frontend URL
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
})); // Middleware to enable CORS

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", userRouter);
app.use("/", connectionsRouter);
app.use("/", chatRouter);

app.use("/", (req, res) => {
    res.status(404).json({ message: "Route not found" });
});


const server = http.createServer(app);
initializeSocket(server);

connectDB().then(() => {
    console.log("Connected to MongoDB");
    server.listen(3000, () => {
        console.log("Server is running on port 3000");
    });
}).catch((err) => {
    console.log("database connection error", err);
});

