const { default: axios } = require('axios');
const {
  fetchCharacters,
  sortCharactersByName,
  sortCharactersByGender,
  sortCharactersByHeight,
  convertCmToFeet,
  filterCharactersByGender,
} = require('../utils');

/**
 * @description: This controller fetches a single movie
 * @route /api/v1/characters/:movieId
 * @param sortBy filterBy orderBy
 * @method GET
 * @returns  name, heightInCm,mass,hair_color,skin_color,eye_color,birth_year,gender,heightInFeet
 */

exports.fetchMovieCharacters = async (req, res) => {
  const { sortBy, filterBy, orderBy = 'asc' } = req.query;
  const { movieId } = req.params;

  const { data: movie } = await axios.get(
    `${process.env.SWAPI_API}/${movieId}`
  );
  // we will probably incorporate redis here to aid in fast response
  const characters = await fetchCharacters(movie.characters);

  if (!characters.length) {
    return res.status(400).json({
      success: false,
      message,
      message: 'Sorry, we could not retrieve any character for this movie',
    });
  }

  // we format the response so we can retrieve character specific data
  let formattedResponse = characters.map(
    ({
      name,
      height,
      mass,
      hair_color,
      skin_color,
      eye_color,
      birth_year,
      gender,
    }) => ({
      name,
      heightInCm: height,
      mass,
      hair_color,
      skin_color,
      eye_color,
      birth_year,
      gender,
    })
  );

  if (sortBy && sortBy.toLowerCase() === 'name') {
    formattedResponse = sortCharactersByName(formattedResponse, orderBy);
  } else if (sortBy && sortBy.toLowerCase() === 'gender') {
    formattedResponse = sortCharactersByGender(formattedResponse, orderBy);
  } else if (sortBy && sortBy.toLowerCase() === 'height') {
    formattedResponse = sortCharactersByHeight(formattedResponse, orderBy);
  }

  if (filterBy) {
    formattedResponse = await filterCharactersByGender(
      formattedResponse,
      filterBy
    );
  }

  if (!formattedResponse.length) {
    return res.status(400).json({
      success: false,
      message,
      message: 'Sorry, we could not retrieve any character for this movie',
    });
  }

  // we add the converted heights
  formattedResponse = formattedResponse.map((response) => ({
    ...response,
    heightInFeet: convertCmToFeet(parseInt(response.heightInCm)),
  }));

  res.status(200).json({
    success: true,
    characterCount: characters.length,
    data: formattedResponse,
  });
};
