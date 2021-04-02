const express = require("express");
const app = express();
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
require("dotenv").config();

const format = function date2str(x, y) {
  var z = {
    M: x.getMonth() + 1,
    d: x.getDate(),
    h: x.getHours(),
    m: x.getMinutes(),
    s: x.getSeconds(),
  };
  y = y.replace(/(M+|d+|h+|m+|s+)/g, function (v) {
    return ((v.length > 1 ? "0" : "") + z[v.slice(-1)]).slice(-2);
  });

  return y.replace(/(y+)/g, function (v) {
    return x.getFullYear().toString().slice(-v.length);
  });
};

let users = [
  {
    _id: "ac9907bb-8a36-433a-be3b-27172d9e91d5",
    username: "leonerd12",
  },
];
let exercises = [];
app.use(cors());

app.use(express.json());

app.use(express.static("public"));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.get("/api/exercise/users", (req, res) => {
  res.json(users);
});

app.post("/api/exercise/new-user", (req, res) => {
  const newUser = {
    _id: uuidv4(),
    username: req.body.username,
  };

  users.push(newUser);

  res.send(newUser);
});

app.post("/api/exercise/add", (req, res) => {
  if (users.map((u) => u["_id"]).includes(req.body.userId)) {
    const newExercise = {
      _id: uuidv4(),
      userId: req.body.userId,
      description: req.body.description,
      duration: req.body.duration,
      date: req.body.date
        ? req.body.date
        : format(new Date(Date.now()), "yyyy-MM-dd"),
    };

    exercises.push(newExercise);

    res.status(200).send(newExercise);
  } else {
    res.status(404).send("userId not existing");
  }
});

app.get("/api/exercise/log", (req, res) => {
  const exercisesMadeByUser = exercises.filter((ex) => {    
    if(ex["userId"] === req.query.userId) {
      return true;
    }

    return false
  });

  res.status(200).send({
    log: exercisesMadeByUser,
    count: exercisesMadeByUser.length,
  });
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
