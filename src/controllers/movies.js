const { default: axios } = require('axios');
const { fetchMovieCommentCount, sortMoviesByReleaseDate } = require('../utils');

/**
 * @description: This controller fetches the list of movies
 * @route /api/v1/movies/
 * @method GET
 * @returns  an array movie_id, opening_crawl, release_date and comment_count
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

    Promise.all(
      movies.results.map(async (movie) => {
        const { title, opening_crawl, release_date, url } = movie;

        let movieId = url.match(/(\d+)/)[0];

        movieId = parseInt(movieId);

        const comment_count = await fetchMovieCommentCount(movieId);

        return {
          movie_id: movieId,
          name: title,
          opening_crawl,
          release_date,
          comment_count,
        };
      })
    ).then((data) => {
      const sortedMovies = sortMoviesByReleaseDate(data);

      return res.status(200).json({
        success: true,
        data: sortedMovies,
        message: 'Movies successfully fetched',
      });
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

/**
 * @description: This controller fetches a single movie
 * @route /api/v1/movies/:movieId
 * @method GET
 * @returns  a single movie with it's movie_id, opening_crawl, release_date and comment_count
 */
exports.fetchMovie = async (req, res) => {
  try {
    let { movieId } = req.params;

    movieId = parseInt(movieId);

    const { data: movie } = await axios.get(
      `${process.env.SWAPI_API}/${movieId}`
    );

    const comment_count = await fetchMovieCommentCount(movieId);

    let formattedMovieResponse = {
      movieId,
      name: movie.title,
      opening_crawl: movie.opening_crawl,
      release_date: movie.release_date,
      comment_count,
    };

    res.status(200).json({
      success: true,
      data: formattedMovieResponse,
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
