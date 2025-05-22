const express = require('express');
const mongoose = require('mongoose');

const User = require("../models/user");
const isAuth = require("../middlewares/authMiddleware");
const Connection = require("../models/connection");

const connectionsRouter = express.Router();

connectionsRouter.post("/request/send/:status/:toUserId", isAuth, async (req, res) => { 
    const fromUser = req.user; 
    const fromUserId = fromUser._id;
    const {status, toUserId} = req.params;

    try {
        const allowedStatuses = ["interested", "ignored"];
        if(!allowedStatuses.includes(status)) {
            return res.status(400).json({message: "Invalid status"});
        }

        const isConnectionPresentAlready = await Connection.findOne(
            {
                $or: [
                    { fromUserId: fromUserId, toUserId: toUserId },
                    { fromUserId: toUserId, toUserId: fromUserId }
                ]
            }
        )
        if(isConnectionPresentAlready) {
            return res.status(400).json({message: "Connection already exists"});
        }

        const toUser = await User.findById(toUserId);
        if(!toUser) {
            return res.status(404).json({message: "User not found"});
        }

        const connection = new Connection({
            fromUserId,
            toUserId,
            status
        });

        await connection.save();

        res.status(200).json({message: `${fromUser.firstName} ${status} ${status === "interested"? "in " : ""}connection request to ${toUser.firstName}`});

    } catch(err) {
        console.error(err);
        return res.status(500).json({message: "Something went wrong: " + err.message});
    }
});


connectionsRouter.post("/request/review/:status/:connectionId", isAuth, async (req, res) => {
    const {status, connectionId} = req.params;
    const loggedInUser = req.user;

    try {
        const allowedStatuses = ["accepted", "rejected"];

        if(!allowedStatuses.includes(status)) {
            return res.status(400).json({message: "Invalid status"});
        }

        const connection = await Connection.findOne({
            _id: connectionId, 
            toUserId: loggedInUser._id, 
            status: "interested"
        });

        if(!connection) {
            return res.status(404).json({message: "Connection not found"});
        }

        connection.status = status;
        const data = await connection.save();
        res.status(200).json({message: `Connection request ${status} successfully`, data});
    
    }catch(err) {
        console.error(err);
        return res.status(500).json({message: "Something went wrong: " + err.message});
    }
});

module.exports = connectionsRouter;
