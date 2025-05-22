const validator = require('validator');

const validateSignup = (req) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new Error("Email and password are required");
    }

    if (!validator.isEmail(email)) {
        throw new Error("Invalid email format");
    }

    if (!validator.isStrongPassword(password)) {
        throw new Error("Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one symbol");
    }
}

const validateEdit = (req) => {
    const { age, gender } = req.body;

    if (typeof age !== 'number' || age < 20) {
        throw new Error("Age must be a number and at least 20");
    }

    if (!["male", "female", "other"].includes(gender)) {
        throw new Error("invalid gender");
    }
}

module.exports = { validateSignup, validateEdit };

