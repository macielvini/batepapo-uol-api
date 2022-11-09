import express from "express";
import cors from "cors";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";

const app = express();

//configs
app.use(cors());
app.use(express.json());
dotenv.config();

//mongo
const mongoClient = new MongoClient(process.env.MONGO_URI);
let db;

db = mongoClient.db("batePapoUol");

//code

//port
app.listen(5000, () => console.log("Server running in port 5000"));
