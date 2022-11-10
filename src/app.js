import express from "express";
import cors from "cors";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import Joi from "joi";

const app = express();

//configs
app.use(cors());
app.use(express.json());
dotenv.config();

//mongo
const mongoClient = new MongoClient(process.env.MONGO_URI);
let db;

//connect mongoClient
try {
  await mongoClient.connect();
  db = mongoClient.db("chatUOL");
} catch (error) {
  console.log(error);
}

//code
app.post("/participants", async (req, res) => {
  const { name } = req.body;
  const schema = Joi.object({ username: Joi.string().alphanum().required() });

  const result = schema.validate(req.body);
  if (result) {
    res.status(422).send(result.error.message);
    return;
  }

  try {
    await db
      .collection("participants")
      .insertOne({ name, lastStatus: Date.now() });
    res.sendStatus(201);
  } catch (error) {
    res.sendStatus(409);
    console.log(error);
  }
});

//port
app.listen(5000, () => console.log("Server running in port 5000"));

function userExist(name) {
  return db.collection("users").findOne(name) ? true : false;
}
