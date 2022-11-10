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
  const body = req.body;
  const schema = Joi.object({ name: Joi.string().alphanum().required() });

  const result = schema.validate(req.body);
  if (result.error) {
    res.status(422).send(result.error);
    return;
  }

  const nameExist = await db.collection("participants").findOne(body);

  if (nameExist) {
    res.sendStatus(409);
    return;
  }

  try {
    await db
      .collection("participants")
      .insertOne({ ...body, lastStatus: Date.now() });
    res.sendStatus(201);
  } catch (error) {
    res.sendStatus(409);
    console.log(error);
  }
});

//port
app.listen(5000, () => console.log("Server running in port 5000"));
