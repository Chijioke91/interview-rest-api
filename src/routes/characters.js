const { Router } = require('express');
const { fetchMovieCharacters } = require('../controllers/characters');

const router = Router();
//Routes definition can be found in the controller
router.get('/:movieId', fetchMovieCharacters);

module.exports = router;
