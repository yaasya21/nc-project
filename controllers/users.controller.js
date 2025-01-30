const { selectUsers, selectUsername } = require("../models/users.model");

exports.getUsers = (req, res, next) => {
  selectUsers().then((users) => {
    res.status(200).send({ users: users });
  });
};

exports.getUserByUsername = (req, res, next) => {
  const { username } = req.params;
  selectUsername(username)
    .then((user) => {
      res.status(200).send({ user: user });
    })
    .catch((err) => {
      next(err);
    });
};
