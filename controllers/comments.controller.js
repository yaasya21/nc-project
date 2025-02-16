const {
  selectCommentsByArticleId,
  insertComment,
  removeComment,
  updateComment,
} = require("../models/comments.model");

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const { limit, p } = req.query;

  const parsedLimit = limit && parseInt(limit);
  const parsedPage = p && parseInt(p);

  selectCommentsByArticleId(article_id, parsedLimit, parsedPage)
    .then(({ comments, total_count }) => {
      res.status(200).send({ comments, total_count });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postComments = (req, res, next) => {
  const { article_id } = req.params;
  const newComment = req.body;

  insertComment(article_id, newComment)
    .then((comment) => {
      res.status(201).send({ comment: comment });
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchComment = (req, res, next) => {
  const { comment_id } = req.params;
  const { inc_votes } = req.body;

  updateComment(comment_id, inc_votes)
    .then((comment) => {
      res.status(200).send({ comment: comment });
    })
    .catch((err) => {
      next(err);
    });
};

exports.deleteComment = (req, res, next) => {
  const { comment_id } = req.params;

  removeComment(comment_id)
    .then(() => {
      res.status(204).send();
    })
    .catch((err) => {
      next(err);
    });
};
