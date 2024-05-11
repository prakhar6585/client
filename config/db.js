import mongoose from 'mongoose'
import colors from 'colors'

const connectDB= async () => {
    try {
        const connect=await mongoose.connect(process.env.MONGO_URL)
        console.log(`Connected to mongodb database ${connect.connection.host}`);
    } catch (error) {
        console.log(`Error in mongodb ${error}`.bgRed.white)
    }
}

export default connectDB