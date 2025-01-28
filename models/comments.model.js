const db = require("../db/connection");
const { checkArticleExists } = require("../utils/checkIfExists");

exports.selectCommentsByArticleId = (article_id) => {
  return checkArticleExists(article_id)
    .then(() => {
      return db.query("SELECT * FROM comments WHERE article_id = $1", [
        article_id,
      ]);
    })
    .then(({ rows }) => {
      return rows;
    });
};

exports.insertComment = (article_id, { username, body }) => {
  return checkArticleExists(article_id)
    .then(() => {
      return db.query(
        "INSERT INTO comments (body, author, article_id) VALUES ($1, $2, $3) RETURNING *;",
        [body, username, article_id]
      );
    })
    .then(({ rows }) => {
      return rows[0];
    });
};
