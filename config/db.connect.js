import mongoose from "mongoose";

const DB = async () => {
    try {
        await mongoose.connect(process.env.DB_URL)
        console.log("Database Connected successfully")
    } catch (error) {
        console.log(`error in connecting with database: ${error.message}`)
    }
}

export default DB;