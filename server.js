import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import serverless from "serverless-http";


import { connectDB } from "./db";
import api from "./routes/api";
dotenv.config();
connectDB();

const app = express();
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())
app.use("/api", api);
app.use('/.netlify/functions/server', api);  // path must route to lambda

module.exports = app;
module.exports.handler = serverless(app);

