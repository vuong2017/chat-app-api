import mongoose from "mongoose";
export const connectDB = () => {
  return new Promise(success => {
    mongoose.connect("mongodb://admin:A123456@ds141198.mlab.com:41198/daulo", { useNewUrlParser: true });
    mongoose.connection.on(
      "error",
      console.error.bind(console, "connection error:")
    );
    mongoose.connection.once("open", function() {
      success();
    });
  });
};
