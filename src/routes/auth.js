const express = require('express');
const bcrypt = require("bcrypt");

const User = require('../models/user');
const { validateSignup } = require("../utils/validation");

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
    //wherever error thrown, put in try-catch block always
    try {
        //validate fields in req body
        validateSignup(req);

        //encrypt the password
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        const { firstName, lastName, email, age, gender } = req.body;

        //for additional security of fields
        const user = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            age,
            gender
        });

        const savedUser = await user.save();

        //create json web token and hide user id in it
        const token = await user.getJWT();
        // send the toen in the cookie
        res.cookie("token", token, { httpOnly: true });

        console.log("User created successfully");
        res.status(200).json(savedUser);
    } catch (err) {
        console.log("Error creating user", err);
        res.status(500).json({ message: "Error creating user " + err.message });
    }
})

authRouter.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email });

        if (!user) {
            throw new Error("Invalid email or password");
        }

        const isMatch = await user.validatePassword(password);

        if (isMatch) {
            //create json web token and hide user id in it
            const token = await user.getJWT();

            console.log("User logged in successfully");

            // send the toen in the cookie
            res.cookie("token", token, { httpOnly: true });
            res.status(200).json(user);
        } else {
            throw new Error("Invalid email or password");
        }

    } catch (err) {
        console.log("Error logging in", err);
        res.status(500).json({ message: "Error logging in: " + err.message });
    }
});

authRouter.post("/logout", async (req, res) => {
    try {
        res.cookie("token", "null", { expires: new Date(0) });
        res.status(200).json({ message: "User logged out successfully" });
    } catch (err) {
        console.log("Error logging out", err);
        res.status(500).json({ message: "Error logging out: " + err.message });
    }
});


module.exports = authRouter;
