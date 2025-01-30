const {
  getArticleById,
  getArticles,
  patchArticle,
} = require("../controllers/articles.controller");

const {
  getCommentsByArticleId,
  postComments,
} = require("../controllers/comments.controller");

const articlesRouter = require("express").Router();

articlesRouter.get("/", getArticles);

articlesRouter.route("/:article_id").get(getArticleById).patch(patchArticle);

articlesRouter
  .route("/:article_id/comments")
  .get(getCommentsByArticleId)
  .post(postComments);

module.exports = articlesRouter;
