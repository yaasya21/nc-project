const db = require("../db/connection");
const { checkIfExists } = require("../utils/checkIfExists");

exports.selectUsers = () => {
  return db.query("SELECT * FROM users").then(({ rows }) => {
    return rows;
  });
};

exports.selectUsername = (username) => {
  if (username.length > 40) {
    return Promise.reject({
      status: 400,
      msg: `Bad request`,
    });
  }
  return checkIfExists(username, "users", "username")
    .then(() => {
      return db.query("SELECT * FROM users WHERE username = $1", [username]);
    })
    .then(({ rows }) => {
      return rows[0];
    });
};
