import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";


import { connectDB } from "./db";
import api from "./routes/api";

dotenv.config();

const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

io.on("connection", function(socket) {
  console.log("a user connected");
  socket.on("disconnect", function() {
    console.log("user disconnected");
  });
});
app.set('socketio', io);
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())
app.use("/api", api);
http.listen(process.env.PORT || 3000, () => {
  console.log(`Server is listening on port 3000`);
  connectDB();
});
