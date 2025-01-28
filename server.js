const express = require("express");
const server = express();
const { getApi } = require("./controllers/api.controller");
const { getTopics } = require("./controllers/topics.controller");
const {
  getArticleById,
  getArticles,
  patchArticle,
} = require("./controllers/articles.controller");
const {
  getCommentsByArticleId,
  postComments,
  deleteComment
} = require("./controllers/comments.controller");

server.use(express.json());

server.get("/api", getApi);
server.get("/api/topics", getTopics);
server.get("/api/articles/:article_id", getArticleById);
server.get("/api/articles", getArticles);
server.get("/api/articles/:article_id/comments", getCommentsByArticleId);

server.post("/api/articles/:article_id/comments", postComments);

server.patch("/api/articles/:article_id", patchArticle);

server.delete("/api/comments/:comment_id", deleteComment);

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
