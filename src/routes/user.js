const express = require('express');

const User = require("../models/user");
const isAuth = require("../middlewares/authMiddleware");
const Connection = require("../models/connection");

const userRouter = express.Router();

userRouter.get("/user/feed", isAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        limit = Math.min(limit, 50); // Limit the maximum number of results to 50

        // Fetch all users except the logged-in user and users which are in connection with the logged-in user
        const connections = await Connection.find({
            $or: [
                { toUserId: loggedInUser._id },
                { fromUserId: loggedInUser._id }
            ]
        });

        const idsToExclude = [];
        connections.forEach((connection) => {
            if (connection.fromUserId.equals(loggedInUser._id)) {
                idsToExclude.push(connection.toUserId);
            } else {
                idsToExclude.push(connection.fromUserId);
            }
        })

        const users = await User.aggregate([
            {
                $match: {
                    _id: { $ne: loggedInUser._id, $nin: idsToExclude }
                }
            },
            {
                $project: {
                    firstName: 1,
                    lastName: 1,
                    age: 1,
                    gender: 1,
                    email: 1,
                    bio: 1,
                    profile: 1
                }
            }
        ]).skip(skip).limit(limit);

        res.status(200).json(users);
    } catch (err) {
        console.log("Error fetching users", err);
        res.status(500).json({ message: "Error fetching users" });
    }
});

userRouter.get("/user/requests/received", isAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const requests = await Connection.find({
            toUserId: loggedInUser._id,
            status: "interested"
        }).populate("fromUserId", "firstName lastName age gender email bio profile");

        if (requests.length === 0) {
            return res.status(404).json({ message: "No requests found" });
        }

        res.status(200).json(requests);

    } catch (err) {
        console.log("Error fetching requests", err);
        res.status(500).json({ message: "Error fetching requests" });
    }
});

userRouter.get("/user/connections", isAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const connections = await Connection.find({
            $or: [
                { toUserId: loggedInUser._id, status: { $in: ["accepted", "rejected"] } },
                { fromUserId: loggedInUser._id, status: { $in: ["accepted", "rejected"] } }
            ]
        }).populate("fromUserId", "firstName lastName age gender email bio profile").populate("toUserId", "firstName lastName age gender email bio profile")


        if (connections.length === 0) {
            return res.status(404).json({ message: "No connections found" });
        }

        const filtered = connections.map((connection) => {
            if (connection.fromUserId._id.equals(loggedInUser._id)) {
                return {
                    ...connection.toUserId._doc,
                    status: connection.status
                }
            } else {
                return {
                    ...connection.fromUserId._doc,
                    status: connection.status
                }
            }
        })
        res.status(200).json(filtered);

    } catch (err) {
        console.log("Error fetching connections", err);
        res.status(500).json({ message: "Error fetching connections" });
    }
});


module.exports = userRouter;
