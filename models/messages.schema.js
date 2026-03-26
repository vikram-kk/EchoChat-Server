import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    sender: String,
    receiver: String,
    message: String,
    roomId: String
}, { timestamps: true })

export const Message = mongoose.model("Message", messageSchema) 