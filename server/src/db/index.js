import mongoose from 'mongoose';
const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/ToDoList`);
    console.log(`\n MongoDB Connected !! DB HOST: ${connectionInstance.connection.host}`);
  }
  catch (error){
    console.log("MongoDB connection Failed: ", error);
    process.exit(1); // Node provide this feature to exit the process
  }
}

export default connectDB;