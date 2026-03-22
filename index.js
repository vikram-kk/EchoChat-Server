import express from 'express'
import http from 'http'
import { Server } from 'socket.io'
import dotenv from 'dotenv'
import cors from "cors"


dotenv.config()

const app = express()
const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: "*"
    }
});
io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("disconnect", () => {
        console.log("User disconnected");
    });
});



app.get("/", (req, res) => {
    res.json("hello Vikram Kumar Thakur")
})



server.listen(process.env.PORT, () => {
    console.log(`server started at port ${process.env.PORT}`);

})