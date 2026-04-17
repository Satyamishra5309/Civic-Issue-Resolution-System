import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.Mongo_URI);
        console.log("Mongodb connected succesfully");
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

export default connectDB;