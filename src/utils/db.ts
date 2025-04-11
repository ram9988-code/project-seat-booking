require("dotenv").config();
import mongoose, { ConnectionStates } from "mongoose";

const dbUrl: string = process.env.DB_URL || "";

const connectDB = async () => {
  const connectionState = await mongoose.connection.readyState;

  if (connectionState === 1) {
    console.log("Already Connected to the Database");
    return;
  }

  if (connectionState === 2) {
    console.log("Connecting to...");
    return;
  }
  try {
    await mongoose
      .connect(dbUrl, {
        dbName: "RestApi",
      })
      .then((data: any) => {
        console.log(`Database connected with ${data.connection.host}`);
      });
    console.log("Connected");
  } catch (error: any) {
    console.log(error.message);
    setTimeout(connectDB, 5000);
    throw new Error("Error", error);
  }
};

export default connectDB;
