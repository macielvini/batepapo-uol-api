import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import dayjs from "dayjs";
import { MongoClient } from "mongodb";
import { validateMessage, validateParticipant } from "../schemas.js";

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

const time = dayjs(Date.now()).format("HH:mm:ss");

//GET
app.get("/participants", async (req, res) => {
  try {
    const participants = await db.collection("participants").find().toArray();
    res.send(participants);
  } catch (error) {
    res.sendStatus(400);
  }
});

app.get("/messages", async (req, res) => {
  const limit = parseInt(req.query.limit) * -1;
  const { user } = req.headers;

  console.log(user);

  try {
    const messages = await db.collection("messages").find().toArray();
    const filteredMessages = messages.filter(
      (m) => m.type === "message" || m.to === user
    );
    res.send(filteredMessages);
  } catch (error) {
    res.sendStatus(404);
  }
});

//POST
app.post("/participants", async (req, res) => {
  const body = req.body;

  const validation = validateParticipant(req.body);
  if (validation.error) {
    const errors = validation.error.details.map((e) => e.message);
    res.status(422).send(errors);
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

    await db.collection("messages").insertOne({
      from: body.name,
      to: "Todos",
      text: "entra na sala...",
      type: "status",
      time: dayjs(Date.now()).format("HH:mm:ss"),
    });

    res.sendStatus(201);
  } catch (error) {
    res.sendStatus(409);
    console.log(error);
  }
});

app.post("/messages", async (req, res) => {
  const body = req.body;
  const { user } = req.headers;

  const validation = validateMessage(body);
  if (validation.error) {
    const error = validation.error.details.map((e) => e.message);
    res.send(error).status(422);
  }

  try {
    await db.collection("participants").findOne({ name: user });
  } catch (error) {
    res.status(422).send("user not found");
    return;
  }

  try {
    await db.collection("messages").insertOne({
      from: user,
      ...body,
      time: time,
    });
    res.sendStatus(201);
  } catch (error) {
    res.send(422);
  }
});

//PUT

//DELETE

//port
app.listen(5000, () => console.log("Server running in port 5000"));
