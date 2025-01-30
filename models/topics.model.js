const db = require("../db/connection");

exports.selectTopics = () => {
  return db.query("SELECT * FROM topics").then((result) => {
    return result.rows;
  });
};

exports.insertTopic = (body) => {
  return db
    .query(
      "INSERT INTO topics (slug, description) VALUES ($1, $2) RETURNING *;",
      [body.slug, body.description]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};
