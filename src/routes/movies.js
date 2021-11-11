const { Router } = require('express');
const { fetchAllMovies } = require('../controllers/movies');

const router = Router();

router.get('/', fetchAllMovies);

module.exports = router;
