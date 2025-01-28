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
