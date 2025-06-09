const express = require('express');

const User = require("../models/user");
const isAuth = require("../middlewares/authMiddleware");
const { validateEdit } = require('../utils/validation');

const profileRouter = express.Router();

profileRouter.get("/profile/view", isAuth, async (req, res) => {
    try {
        const user = req.user; // Access the user from the request object
        if (!user) {
            return res.status(404).json({ message: "Something went wrong" });
        }

        res.status(200).json(user);
    } catch (err) {
        console.log("Error fetching profile", err);
        res.status(500).json({ message: "Error fetching profile: " + err.message });
    }
});

profileRouter.patch("/profile/edit", isAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        validateEdit(req);

        const allowedFields = ["age", "gender", "firstName", "lastName", "bio", "profile"];

        allowedFields.every((key) => loggedInUser[key] = req.body[key]);

        loggedInUser.save();
        res.status(200).json({ message: "User updated successfully" });

    } catch (err) {
        console.log("Error updating user", err);
        res.status(500).json({ message: "Error updating user: " + err.message });
    }
});

module.exports = profileRouter;
