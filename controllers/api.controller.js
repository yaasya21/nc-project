const { getFile } = require("../models/api.model");

exports.getApi = (req, res, next) => {
  const endpoints = getFile();
  res.status(200).send({ endpoints: endpoints });
};
