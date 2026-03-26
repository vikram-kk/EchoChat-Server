import express from 'express'
import http from 'http'
import { Server } from 'socket.io'
import dotenv from 'dotenv'
import DB from './config/db.connect.js'
import { Message } from './models/messages.schema.js'
import cors from "cors"



dotenv.config()

const app = express()
app.use(express.json())
const server = http.createServer(app)
DB()

let onlineUsers = {}

const io = new Server(server, {
    cors: {
        origin: "*"
    }
});
io.on("connection", (socket) => {
    socket.on("addUser", (userId) => {
        onlineUsers[userId] = socket.id
        console.log("online Users: ", onlineUsers)

        io.emit("getOnlineUsers", Object.keys(onlineUsers))
    })
    console.log("User connected:", socket.id);

    socket.on("joinRoom", async ({ user1, user2 }) => {
        const roomId = [user1, user2].sort().join("_");
        socket.join(roomId)
        console.log(`${user1} is connected in ${roomId}`)
        const messages = await Message.find({ roomId }).sort({ createdAt: 1 })
        socket.emit("chatHistory", messages)
    })


    socket.on("sendMessage", async ({ sender, receiver, message }) => {
        console.log("Message received:", message);
        const roomId = [sender, receiver].sort().join("_")
        const newMessage = new Message({
            sender,
            receiver,
            message,
            roomId
        }); await newMessage.save()
        io.to(roomId).emit("receiveMessage", { sender, message });
    });

    socket.on("disconnect", () => {
        for (let userId in onlineUsers) {
            if (onlineUsers[userId] === socket.id) {
                delete (onlineUsers[userId])
            }
        }
        io.emit("getOnlineUsers", Object.keys(onlineUsers))
        console.log("User disconnected");
    });
});



app.get("/", (req, res) => {
    res.json("hello Vikram Kumar Thakur")
})



server.listen(process.env.PORT, () => {
    console.log(`server started at port ${process.env.PORT}`);

})