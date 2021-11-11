const { Router } = require('express');
const { fetchMovieCharacters } = require('../controllers/characters');

const router = Router();

router.get('/:movieId', fetchMovieCharacters);

module.exports = router;
