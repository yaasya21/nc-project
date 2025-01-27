const express = require("express");
const server = express();
const { getApi } = require("./controllers/api.controller");

server.use(express.json());

server.get("/api", getApi); 

server.use((err, req, res, next) => {
    if ((err.code === "ENOENT")) {
        console.log(err);
        res.status(500).send({ msg: "Internal Server Error" });
      } else {
        next(err);
      }
    });

module.exports = server;
