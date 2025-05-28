const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const userSchema = mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true,
            minLength: 4,
        },
        lastName: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            unique: true,
            trim: true,
            lowercase: true,
            validate: (value) => {
                if (!validator.isEmail(value)) {
                    throw new Error("invalid email");
                }
            },
        },
        password: {
            type: String,
        },
        age: {
            type: Number,
            min: 20,
        },
        gender: {
            type: String,
            validate: (value) => {
                if (!["male", "female", "other"].includes(value)) {
                    throw new Error("invalid gender");
                }
            },
        },
        profile: {
            type: String,
        },
        bio: {
            type: String,
        }
    },
    { timestamps: true }
);


userSchema.methods.getJWT = async function () {
    const user = this;
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    return token;
}

userSchema.methods.validatePassword = async function (password) {
    const user = this;
    const isMatch = await bcrypt.compare(password, user.password);
    return isMatch;
}

const User = mongoose.model('User', userSchema);

module.exports = User;
