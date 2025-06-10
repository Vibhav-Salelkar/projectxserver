const socket = require("socket.io");
const crypto = require("crypto");
const Chat = require("../models/chat");

const getSecretRoomId = (userId, targetUserId) => {
    const sortedIds = [userId, targetUserId].sort();
    return crypto.createHash('sha256').update(sortedIds.join('_')).digest('hex');
};

const initializeSocket = (server) => {
    const io = socket(server, {
        cors: {
            origin: "http://localhost:5173",
            credentials: true
        },
    });

    io.on("connection", (socket) => {
        console.log("New client connected");

        socket.on("disconnect", () => {
            console.log("Client disconnected");
        });

        socket.on("joinChat", ({userId, targetUserId} )=> {
            const roomId = getSecretRoomId(userId, targetUserId);
            socket.join(roomId);
        });

        socket.on("sendMessage", async ({firstName, lastName, userId, targetUserId, message}) => {
            console.log("send message", {firstName, userId, targetUserId, message});
            const roomId = getSecretRoomId(userId, targetUserId);

            //save message to database 
            try {
                let chat = await Chat.findOne({
                    participants: {$all: [userId, targetUserId]}
                })

                if(!chat) {
                    chat = new Chat({
                        participants: [userId, targetUserId],
                        messages: []
                    });       
                }

                chat.messages.push({
                    senderId: userId,
                    text: message
                });

                await chat.save();
            }catch (error) {
                console.error("Error saving message:", error);
            }

            io.to(roomId).emit("messageReceived", {firstName, lastName, message});
        });
    });
}

module.exports = { initializeSocket };