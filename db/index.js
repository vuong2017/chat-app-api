import mongoose from "mongoose";
export const connectDB = () => {
  return new Promise(success => {
    mongoose.connect(process.env.DBURL, { useNewUrlParser: true });
    mongoose.connection.on(
      "error",
      console.error.bind(console, "connection error:")
    );
    mongoose.connection.once("open", function() {
      success();
    });
  });
};
