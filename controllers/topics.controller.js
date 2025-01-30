const { selectTopics, insertTopic } = require("../models/topics.model");

exports.getTopics = (req, res, next) => {
  selectTopics().then((topics) => {
    res.status(200).send({ topics: topics });
  });
};

exports.postTopic = (req, res, next) => {
  const newTopic = req.body;

  insertTopic(newTopic)
    .then((topic) => {
      res.status(201).send({ topic: topic });
    })
    .catch((err) => {
      next(err);
    });
};
