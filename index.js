import express from 'express'
import http from 'http'
import { Server } from 'socket.io'
import dotenv from 'dotenv'


dotenv.config()

const app = express()
const server = http.createServer(app)

const io = new Server(server)

app.get("/", (req, res) => {
    res.json("hello Vikram Kumar Thakur")
})



server.listen(process.env.PORT, () => {
    console.log(`server started at port ${process.env.PORT}`);

})