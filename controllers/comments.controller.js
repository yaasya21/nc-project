const {
  selectCommentsByArticleId,
  insertComment,
  removeComment,
} = require("../models/comments.model");

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  selectCommentsByArticleId(article_id)
    .then((comments) => {
      res.status(200).send({ comments: comments });
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
  
