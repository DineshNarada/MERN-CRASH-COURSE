import mongoose from 'mongoose';

export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    }
    catch (error) {
        console.error(`Failed to connect to DB: ${error.message}`);
        process.exit(1); //Exit the process code 1 with failure, Code 0 is success.
    }
};
