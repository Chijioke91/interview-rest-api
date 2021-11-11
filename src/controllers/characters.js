const { default: axios } = require('axios');
const {
  fetchCharacters,
  sortCharactersByName,
  sortCharactersByGender,
  sortCharactersByHeight,
  convertCmToFeet,
} = require('../utils');

exports.fetchMovieCharacters = async (req, res) => {
  const { sortBy, orderBy = 'asc' } = req.query;
  const { movieId } = req.params;

  const { data: movie } = await axios.get(
    `${process.env.SWAPI_API}/${movieId}`
  );

  // we will probably incorporate redis here to aid in fast response
  const characters = await fetchCharacters(movie.characters);

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

  if (sortBy && sortBy === 'name') {
    formattedResponse = sortCharactersByName(formattedResponse, orderBy);
  } else if (sortBy === 'gender') {
    formattedResponse = sortCharactersByGender(formattedResponse, orderBy);
  } else if (sortBy === 'height') {
    formattedResponse = sortCharactersByHeight(formattedResponse, orderBy);
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
