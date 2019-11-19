import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import serverless from "serverless-http";


const router = express.Router();

import { connectDB } from "./db";
import api from "./routes/api";
connectDB();
dotenv.config();

const app = express();
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())
app.use("/api", api);
app.use('/.netlify/functions/server', api);  // path must route to lambda

module.exports = app;
module.exports.handler = serverless(app);

