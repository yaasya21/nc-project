const express = require("express");
const server = express();
const { getApi } = require("./controllers/api.controller");
const { getTopics } = require("./controllers/topics.controller");

server.use(express.json());

server.get("/api", getApi); 

server.get("/api/topics", getTopics); 

module.exports = server;
