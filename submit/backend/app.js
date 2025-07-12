var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");
var dotenv = require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const { Server } = require("socket.io");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");

const user = encodeURIComponent(process.env.MONGO_USER);
const password = encodeURIComponent(process.env.MONGO_PW);
const cluster = encodeURIComponent(process.env.MONGO_CLUSTER);

const uri = `mongodb+srv://${user}:${password}@${cluster}/?retryWrites=true&w=majority&appName=ITFSD`;

var app = express();
app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const io = new Server(3002, {
  cors: { origin: "http://localhost:5173" },
});

io.on("connection", (socket) => {
  console.log(`A user connected with ID: ${socket.id}`);


  socket.on("joinWorkoutRoom", () => {
    socket.join("workout-updates");
  });
});

app.use("/", indexRouter);
app.use("/users", usersRouter);

let db;

async function connectDB() {
  await client.connect();
  db = client.db("gymtracker");
  console.log("Connected to DB");
}

connectDB();

app.post("/api/addexercise", async (req, res) => {
  const keys = Object.keys(req.body);
  const date = keys.find((keys) => keys !== "userid");

  if (
    !req.body[date].exercise ||
    !req.body[date].sets ||
    !req.body[date].weight ||
    !req.body[date].reps ||
    !req.body[date].rir
  ) {
    return res.status(400).json({ error: "Some form fields are missing" });
  }
  const collection = await db.collection("exercises");
  let newData = req.body;
  let result = await collection.insertOne(newData);

  const exerciseData = req.body[date];
  io.to("workout-updates").emit("newExercise", {
    exercise: exerciseData.exercise,
    sets: exerciseData.sets,
    weight: exerciseData.weight,
    reps: exerciseData.reps,
  });

  res.status(204).send(result);
});

app.get("/api/exerciselist", async (req, res) => {
  const collection = await db.collection("exercises");
  const results = await collection.find({ userid: req.query.userid }).toArray();
  res.status(200).send(results);
});

app.delete("/api/deleteexercise", async (req, res) => {
  const query = { _id: new ObjectId(req.query._id) };
  const collection = await db.collection("exercises");
  const result = await collection.deleteOne(query);
  res.status(200).send(result);
});

app.put("/api/editexercise", async (req, res) => {
  const id = req.body._id;
  const newData = {
    $set: {
      [`${req.body.date}.exercise`]: req.body.exercise,
      [`${req.body.date}.sets`]: req.body.sets,
      [`${req.body.date}.weight`]: req.body.weight,
      [`${req.body.date}.reps`]: req.body.reps,
      [`${req.body.date}.rir`]: req.body.rir,
    },
  };
  const collection = await db.collection("exercises");
  const result = await collection.updateOne({ _id: new ObjectId(id) }, newData);
  res.send(result).status(200);
});

app.post("/api/login", async (req, res) => {
  if (req.body.username === "test" && req.body.password === "test") {
    res.status(200).json({ success: true });
  } else {
    res.status(401).send({ error: "Invalid username or password" });
  }
});

app.delete("/api/deleteallexercises", async (req, res) => {
  const collection = await db.collection("exercises");
  const result = await collection.deleteMany({ userid: req.query.userid });
  res.json({ deletedCount: result.deletedCount });
});

app.get("/api/randomtip", (req, res) => {
  const tips = [
    "Stay hydrated!",
    "Warm up before lifting.",
    "Track your progress.",
    "Rest is important for muscle growth.",
    "Maintain good form to prevent injury.",
  ];
  const tip = tips[Math.floor(Math.random() * tips.length)];
  res.json({ tip });
});

app.get("/api/stats", async (req, res) => {
  const collection = await db.collection("exercises");
  const exercises = await collection
    .find({ userid: req.query.userid })
    .toArray();

  const totalExercises = exercises.length;
  let exerciseCounts = {};
  let totalWeight = 0;

  exercises.forEach((item) => {
    const dateData = item[Object.keys(item)[2]];
    const ex = dateData.exercise;
    const sets = Number(dateData.sets) || 0;
    const weight = Number(dateData.weight) || 0;
    exerciseCounts[ex] = (exerciseCounts[ex] || 0) + 1;
    totalWeight += sets * weight;
  });
  const mostCommonExercise =
    Object.entries(exerciseCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || null;

  res.json({
    totalExercises,
    mostCommonExercise,
    totalWeightLifted: totalWeight,
  });
});

module.exports = app;
