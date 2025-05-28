const jwt = require("jsonwebtoken");
const User = require("../models/user");

const isAuth = async (req, res, next) => {
    try {
        //get the token from the cookie
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        //decode the token and get the hidden id added during signing/creation
        const decoded = await jwt.verify(token, process.env.JWT_SECRET);
        console.log(decoded);
        const userId = decoded.id;

        //find the user by 
        const user = await User.findById(userId);
        console.log(user);
        if (!user) {
            return res.status(404).json({ message: "Something went wrong" });
        }

        req.user = user; // Attach the user to the request object
        next(); // Call the next middleware or route handler
    } catch (err) {
        console.log("Error fetching profile", err);
        res.status(500).json({ message: "Error fetching profile: " + err.message });
    }
}

module.exports = isAuth;
