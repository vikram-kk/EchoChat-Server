import express from 'express'
import http from 'http'
import { Server } from 'socket.io'
import dotenv from 'dotenv'
import cors from "cors"



dotenv.config()

const app = express()
app.use(express.json())
const server = http.createServer(app)


let onilineUsers = {}

const io = new Server(server, {
    cors: {
        origin: "*"
    }
});
io.on("connection", (socket) => {
    socket.on("addUser", (userId) => {
        onilineUsers[userId] = socket.id
        console.log("online Users: ", onilineUsers)

        io.emit("getOnlineUsers", Object.keys(onilineUsers))
    })
    console.log("User connected:", socket.id);

    socket.on("joinRoom", ({ user1, user2 }) => {
        const roomId = [user1, user2].sort().join("_");
        socket.join(roomId)
        console.log(`${user1} is connected in ${roomId}`)
    })


    socket.on("sendMessage", ({ sender, receiver, message }) => {
        console.log("Message received:", message);
        const roomId = [sender, receiver].sort().join("_")
        io.to(roomId).emit("receiveMessage", { sender, message });
    });

    socket.on("disconnect", () => {
        for (let userId in onilineUsers) {
            if (onilineUsers[userId] === socket.id) {
                delete (onilineUsers[userId])
            }
        }
        io.emit("getOnlineUsers", Object.keys(onilineUsers))
        console.log("User disconnected");
    });
});



app.get("/", (req, res) => {
    res.json("hello Vikram Kumar Thakur")
})



server.listen(process.env.PORT, () => {
    console.log(`server started at port ${process.env.PORT}`);

})