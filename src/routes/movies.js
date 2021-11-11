const { Router } = require('express');
const { fetchAllMovies, fetchMovie } = require('../controllers/movies');

const router = Router();

router.get('/', fetchAllMovies);
router.get('/:movieId', fetchMovie);

module.exports = router;
