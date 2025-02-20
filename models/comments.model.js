const db = require("../db/connection");
const { checkIfExists } = require("../utils/checkIfExists");

exports.selectCommentsByArticleId = (article_id, limit = 10, page = 1) => {
  return checkIfExists(article_id, "articles", "article_id").then(() => {
    const offset = (page - 1) * limit;
    const queryParams = [article_id, limit, offset];

    let query = `SELECT * 
      FROM comments 
      WHERE article_id = $1 
      ORDER BY created_at DESC
      LIMIT $2 OFFSET $3`;

    let countQuery = `SELECT COUNT(*) AS total_count FROM comments WHERE article_id = $1`;
    return Promise.all([
      db.query(query, queryParams),
      db.query(countQuery, [article_id]),
    ]).then(([commentsResult, countResult]) => {
      const comments = commentsResult.rows;
      const total_count = parseInt(countResult.rows[0].total_count);

      return { comments, total_count };
    });
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

exports.updateComment = (comment_id, newVote) => {
  return checkIfExists(comment_id, "comments", "comment_id")
    .then(() => {
      return db.query(
        "UPDATE comments SET votes = votes + $1 WHERE comment_id = $2 RETURNING *;",
        [newVote, comment_id]
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
