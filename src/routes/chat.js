const express = require('express');
const isAuth = require('../middlewares/authMiddleware');
const Chat = require('../models/chat');

const chatRouter = express.Router();

chatRouter.get('/chat/:targetUserId', isAuth, async (req, res) => {
    const {targetUserId} = req.params;
    const userId = req.user._id;

    try {
        let chat = await Chat.findOne({
            participants: { $all: [userId, targetUserId] }
        }).populate({
            path: "messages.senderId",
            select: "firstName lastName"
        });

        if(!chat) {
            chat = new Chat({
                participants: [userId, targetUserId],
                messages: []
            });
        }

        await chat.save();

        res.status(200).json(chat);
    }catch(err) {
        console.error(err);
    }
});

module.exports = chatRouter;
