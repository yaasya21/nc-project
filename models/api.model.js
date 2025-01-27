const db = require("../db/connection");
const fs = require("fs/promises");

exports.getFile = () => {
  return fs
    .readFile(`${__dirname}/../endpoints.json`, "utf-8")
    .then((data) => JSON.parse(data));
};
