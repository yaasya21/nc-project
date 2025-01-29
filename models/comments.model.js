const db = require("../db/connection");
const { checkIfExists } = require("../utils/checkIfExists");

exports.selectCommentsByArticleId = (article_id) => {
  return checkIfExists(article_id, "articles", "article_id")
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
  return checkIfExists(article_id, "articles", "article_id")
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

exports.removeComment = (comment_id) => {
  return checkIfExists(comment_id, "comments", "comment_id").then(() => {
    return db.query("DELETE FROM comments WHERE comment_id = $1", [comment_id]);
  });
};
