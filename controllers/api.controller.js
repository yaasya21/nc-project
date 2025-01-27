const { getFile } = require("../models/api.model");

exports.getApi = (req, res, next) => {
  getFile()
    .then((endpoints) => {
      res.status(200).send({ endpoints: endpoints });
    })
    .catch((err) => {
      next(err);
    });
};
