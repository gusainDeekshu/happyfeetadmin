
import mongoose from "mongoose";
const MONGO_URI = process.env.MONGODB_URI;


const connectMongodb = async () => {
  try {
    const { connection } = await mongoose.connect(MONGO_URI);
    if (connection.readyState == 1) {
      console.log("Database Connected");
    }else{
      console.log("Error in Connection");
    }
  } catch (errors) {
    return Promise.reject(errors);
  }
};


export default connectMongodb;