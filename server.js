const express = require("express");
const app = express();
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
require("dotenv").config();

let users = [];

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
  console.log(req.body);
  const newUser = {
    _id: uuidv4(),
    username: req.body.username,
  };

  users.push(newUser);

  res.send(newUser);
});

app.post("/api/exercise/add", (req, res) => {
  console.log("add exercise");
});

app.get("/api/exercise/log?{userId}[&from][&to][&limit]", (req, res) => {
  console.log("get logs");
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
