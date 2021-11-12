const { Router } = require('express');
const { fetchAllMovies, fetchMovie } = require('../controllers/movies');

const router = Router();
//Routes definition can be found in the controller
router.get('/', fetchAllMovies);
router.get('/:movieId', fetchMovie);

module.exports = router;
