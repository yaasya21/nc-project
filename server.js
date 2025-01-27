const express = require("express");
const server = express();
const { getApi } = require("./controllers/api.controller");
const { getTopics } = require("./controllers/topics.controller");
const { getArticleById } = require("./controllers/articles.controller");

server.use(express.json());

server.get("/api", getApi);
server.get("/api/topics", getTopics);
server.get("/api/articles/:article_id", getArticleById);

server.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Bad request" });
  } else {
    next(err);
  }
});

server.use((err, req, res, next) => {
  if (err.msg === "valid but non-existent id") {
    res
      .status(404)
      .send({ msg: "requested object with a such id does not exist" });
  } else {
    next(err);
  }
});

module.exports = server;
