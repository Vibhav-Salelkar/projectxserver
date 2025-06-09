const mongoose = require('mongoose');

const connectionSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: {
            values: ["interested", "ignored", "accepted", "rejected"],
            message: "Invalid Status"
        }
    }
}, { timestamps: true });

// compund index for faster queries
connectionSchema.index({ fromUserId: 1, toUserId: 1 });

connectionSchema.pre("save", function (next) {
    const connection = this;
    if(connection.fromUserId.equals(connection.toUserId)) {
        throw new Error("Nice try! But you cannot connect with yourself");
    }
    next();
});

const Connection = mongoose.model("Connection", connectionSchema);

module.exports = Connection;
