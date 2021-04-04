const express = require("express");
const app = express();
const cors = require("cors");

require("dotenv").config();

let users = [];
let exercises = [];
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));;

app.use(express.static("public"));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.get("/api/exercise/users", (req, res) => {
  res.json(users);
});

app.post("/api/exercise/new-user", (req, res) => {
  const newUser = {
    _id: (users.length + 1).toString(),
    username: req.body.username,
  };

  users.push(newUser);

  res.status(200).json(newUser);
});

app.post("/api/exercise/add", (req, res) => {
  const { userId, description, duration, date } = req.body;
  const exDate = date ? new Date(date) : new Date(Date.now());

  const userSearched = users.find(u => u["_id"] == userId)

  const newExercise = {
    ...userSearched,
    description,
    duration : parseInt(duration),
    date: exDate.toDateString()
  };

  exercises.push(newExercise);

  res.status(200).json(newExercise);

});

app.get("/api/exercise/log", (req, res) => {
  const userId = req.query.userId.toString();
  const from = req.query.from ? new Date(req.query.from) : null;
  const to = req.query.to ? new Date(req.query.to) : null;
  
  const userSearched = users.find(u => u["_id"] == userId)
  const limit = req.query.limit || exercises.length;

  let logToReturn;
  logToReturn = exercises.filter((ex) => ex["_id"] == userId);

  if(from && to){
    logToReturn = logToReturn.filter(ex => new Date(ex.date).getTime() >= from.getTime() && new Date(ex.date).getTime() <= to.getTime());
  }

  if(limit){
    logToReturn = logToReturn.slice(0, limit);
  }

  res.status(200).json({
    ...userSearched,
    log: logToReturn,
    count: logToReturn.length,
  });
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
