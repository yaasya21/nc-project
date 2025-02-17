const express = require("express");
const server = express();
const apiRoutes = require("./routes/api-router");
const topicsRoutes = require("./routes/topics-router");
const usersRoutes = require("./routes/users-router");
const articlesRoutes = require("./routes/articles-router");
const commentsRoutes = require("./routes/comments-router");
const cors = require('cors');

server.use(cors());

server.use(express.json());

server.use("/api", apiRoutes);
server.use("/api/topics", topicsRoutes);
server.use("/api/users", usersRoutes);
server.use("/api/articles", articlesRoutes);
server.use("/api/comments", commentsRoutes);

server.use((err, req, res, next) => {
  if (err.code === "22P02" || err.code === "23502" || err.code === "23503") {
    res.status(400).send({ msg: "Bad request" });
  } else {
    next(err);
  }
});

server.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
});

server.use((err, req, res, next) => {
  console.log(err, " <-- This error is not handled yet");
  res.status(500).send({ msg: "Internal Server Error" });
});

module.exports = server;
