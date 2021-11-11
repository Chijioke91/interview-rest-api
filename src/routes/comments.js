const { Router } = require('express');
const {
  createComment,
  fetchComments,
  fetchMovieComments,
} = require('../controllers/comments');

const router = Router();

router.get('/', fetchComments);

router.get('/:movieId', fetchMovieComments);

router.post('/:movieId', createComment);

module.exports = router;
