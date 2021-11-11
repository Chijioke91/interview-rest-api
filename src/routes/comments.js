const { Router } = require('express');
const {
  createMovieComment,
  fetchAllComments,
  fetchMovieComments,
  deleteMovieComment,
  updateMovieComment,
} = require('../controllers/comments');

const router = Router();

router.post('/', createMovieComment);

router.get('/', fetchAllComments);

router.get('/:movieId', fetchMovieComments);
router.delete('/:movieId/:commentId', deleteMovieComment);
router.put('/:movieId/:commentId', updateMovieComment);

module.exports = router;
