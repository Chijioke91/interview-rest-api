const { Router } = require('express');
const {
  createMovieComment,
  fetchAllComments,
  fetchMovieComments,
  deleteMovieComment,
  updateMovieComment,
} = require('../controllers/comments');

const router = Router();

//Routes definition can be found in the controller
// router.post('/', createMovieComment);
// router.get('/', fetchAllComments);

//The above two can be summarized as below;
router.route('/').post(createMovieComment).get(fetchAllComments);

router.get('/:movieId', fetchMovieComments);
router.put('/:movieId/:commentId', updateMovieComment);
router.delete('/:movieId/:commentId', deleteMovieComment);

module.exports = router;
