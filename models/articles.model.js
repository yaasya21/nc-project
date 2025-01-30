const db = require("../db/connection");
const { checkIfExists } = require("../utils/checkIfExists");

exports.selectArticleById = (article_id) => {
  return checkIfExists(article_id, "articles", "article_id")
    .then(() => {
      return db.query(
        "SELECT a.author, a.title, a.article_id, a.topic, a.body, a.created_at, a.votes, a.article_img_url, COUNT(*) AS comment_count FROM articles AS a LEFT JOIN comments AS c ON a.article_id=c.article_id WHERE a.article_id = $1 GROUP BY a.article_id",
        [article_id]
      );
    })
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.selectArticles = (
  sortBy = "created_at",
  order = "desc",
  topic = null
) => {
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
  const orderByClause = `a.${sortBy} ${order}`;
  let query = `SELECT a.author, a.title, a.article_id, a.topic, a.created_at, a.votes, a.article_img_url, COUNT(*) AS comment_count FROM articles AS a LEFT JOIN comments AS c ON a.article_id=c.article_id`;

  if (topic) {
    query += ` WHERE a.topic = $1`;
  }

  query += ` GROUP BY a.article_id ORDER BY ${orderByClause}`;

  if (topic) {
    return checkIfExists(topic, "topics", "slug")
      .then(() => {
        return db.query(query, [topic]);
      })
      .then(({ rows }) => {
        return rows;
      });
  } else {
    return db.query(query).then(({ rows }) => {
      return rows;
    });
  }
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

exports.insertArticle = (body) => {
  return checkIfExists(body.author, "users", "username")
    .then(() => {
      return checkIfExists(body.topic, "topics", "slug");
    })
    .then(() => {
      let query = `INSERT INTO articles (title, topic, author, body`;
      let values = [body.title, body.topic, body.author, body.body];

      if (body.article_img_url) {
        query += `, article_img_url`;
        values.push(body.article_img_url);
      }

      query += `) VALUES ($1, $2, $3, $4`;
      if (body.article_img_url) {
        query += `, $5`;
      }
      query += `) RETURNING *;`;

      return db.query(query, values);
    })
    .then(({ rows }) => {
      return { ...rows[0], comment_count: 0 };
    });
};

exports.removeArticle = (article_id) => {
  return checkIfExists(article_id, "articles", "article_id")
    .then(() => {
      return db.query("DELETE FROM comments WHERE article_id = $1", [
        article_id,
      ]);
    })
    .then(() => {
      return db.query("DELETE FROM articles WHERE article_id = $1", [
        article_id,
      ]);
    });
};
