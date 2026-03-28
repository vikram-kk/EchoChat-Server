import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    sender: String,
    receiver: String,
    message: String,
    roomId: String,
    status: {
        type: String,
        default: "sent",
        enum: ['sent', "seen"]
    }
}, { timestamps: true })

export const Message = mongoose.model("Message", messageSchema) 