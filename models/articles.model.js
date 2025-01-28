const db = require("../db/connection");
const { checkArticleExists } = require("../utils/checkIfExists");

exports.selectArticleById = (article_id) => {
  return checkArticleExists(article_id)
    .then(() => {
      return db.query("SELECT * FROM articles WHERE article_id = $1;", [
        article_id,
      ]);
    })
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.selectArticles = () => {
  return db
    .query(
      "SELECT a.author, a.title, a.article_id, a.topic, a.created_at, a.votes, a.article_img_url, COUNT(*) AS comment_count FROM articles AS a LEFT JOIN comments AS c ON a.article_id=c.article_id GROUP BY a.article_id ORDER BY a.created_at DESC"
    )
    .then((result) => {
      return result.rows;
    });
};

exports.updateArticle = (article_id, newVote) => {
  return checkArticleExists(article_id)
    .then(() => {
      return db.query(
        "UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;",
        [newVote, article_id]
      );
    })
    .then(({ rows }) => { 
      return rows[0];
    });
};
