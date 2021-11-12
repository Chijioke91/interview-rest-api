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
router.put('/:movieId/:commentId', updateMovieComment);
router.delete('/:movieId/:commentId', deleteMovieComment);

module.exports = router;
