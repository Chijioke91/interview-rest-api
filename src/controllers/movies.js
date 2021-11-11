const { default: axios } = require('axios');
const { fetchMovieCommentCount } = require('../utils');

/**
 * @desc fetch all movies
 * @route /api/v1/movies
 * @returns all movies in a results array
 */
exports.fetchAllMovies = async (req, res, next) => {
  try {
    // the movie contains a data field that returns the result, so we destructure that and then rename it to movies
    const { data: movies } = await axios.get(process.env.SWAPI_API);

    // check if movies are returned
    if (!movies.results) {
      return res
        .status(400)
        .json({ success: false, message: 'No movies found' });
    }

    const formattedResponse = movies.results
      .map(async ({ title, opening_crawl, release_date, url }) => {
        const movieId = url.match(/(\d+)/);

        const commentCount = await fetchMovieCommentCount(parseInt(movieId[0]));

        return {
          movieId: parseInt(movieId[0]),
          title,
          opening_crawl,
          release_date,
          commentCount,
        };
      })
      .sort(
        (a, b) =>
          new Date(a.release_date).valueOf() -
          new Date(b.release_date).valueOf()
      );

    res.status(200).json({
      success: true,
      data: formattedResponse,
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

exports.fetchMovie = async (req, res) => {
  try {
    let { movieId } = req.params;

    movieId = parseInt(movieId);

    const { data: movie } = await axios.get(
      `${process.env.SWAPI_API}/${movieId}`
    );

    const commentCount = await fetchMovieCommentCount(movieId);

    let formattedMovieResponse = {
      movieId,
      title: movie.name,
      opening_crawl: movie.opening_crawl,
      release_date: movie.release_date,
      commentCount,
    };

    console.log('cj', movie);

    res.status(200).json({
      success: true,
      data: formattedMovieResponse,
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
