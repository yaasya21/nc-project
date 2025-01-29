const db = require("../db/connection");
const { checkIfExists } = require("../utils/checkIfExists");

exports.selectArticleById = (article_id) => {
  return checkIfExists(article_id, "articles", "article_id")
    .then(() => {
      return db.query("SELECT * FROM articles WHERE article_id = $1;", [
        article_id,
      ]);
    })
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.selectArticles = (sortBy = "created_at", order = "desc") => {
  const validSortBy = ["author", "title", "topic", "created_at", "votes"];
  const validOrder = ["asc", "desc"];
  if (!validSortBy.includes(sortBy.toLowerCase())) {
    return Promise.reject({
      status: 400,
      msg: `Invalid sort_by parameter: ${sortBy}`,
    });
  }
  if (!validOrder.includes(order.toLowerCase())) {
    return Promise.reject({
      status: 400,
      msg: `Invalid order parameter: ${order}`,
    });
  }

  const orderByClause = `ORDER BY a.${sortBy} ${order}`;

  return db
    .query(
      `SELECT a.author, a.title, a.article_id, a.topic, a.created_at, a.votes, a.article_img_url, 
              COUNT(c.comment_id) AS comment_count 
       FROM articles AS a 
       LEFT JOIN comments AS c ON a.article_id = c.article_id 
       GROUP BY a.article_id 
       ${orderByClause};`
    )
    .then(({ rows }) => {
      return rows;
    });
};

exports.updateArticle = (article_id, newVote) => {
  return checkIfExists(article_id, "articles", "article_id")
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
