const { default: axios } = require('axios');

function paginator(items, current_page, per_page_items) {
  let page = current_page || 1,
    per_page = per_page_items || 10,
    offset = (page - 1) * per_page,
    paginatedItems = items.slice(offset).slice(0, per_page_items),
    total_pages = Math.ceil(items.length / per_page);

  return {
    page: page,
    previous_page: page - 1 ? page - 1 : null,
    next_page: total_pages > page ? page + 1 : null,
    count: items.length,
    data: paginatedItems,
  };
}

const fetchCharacters = async (characterArray) => {
  return Promise.all(characterArray.map((u) => axios.get(u))).then(
    (responses) =>
      Promise.all(responses.map((response) => response.data)).then(
        (char) => char
      )
  );
};

const sortCharactersByName = (characterArr, orderBy) => {
  if (orderBy === 'asc') {
    return characterArr.sort((a, b) => {
      if (a.name > b.name) {
        return 1;
      } else if (b.name > a.name) {
        return -1;
      } else {
        return 0;
      }
    });
  } else if (orderBy === 'desc') {
    return characterArr.sort((a, b) => {
      if (b.name > a.name) {
        return 1;
      } else if (a.name > b.name) {
        return -1;
      } else {
        return 0;
      }
    });
  }
};

const sortCharactersByGender = (characterArr, orderBy) => {
  if (orderBy === 'asc') {
    return characterArr.sort((a, b) => {
      if (a.gender > b.gender) {
        return 1;
      } else if (b.gender > a.gender) {
        return -1;
      } else {
        return 0;
      }
    });
  } else if (orderBy === 'desc') {
    return characterArr.sort((a, b) => {
      if (b.gender > a.gender) {
        return 1;
      } else if (a.gender > b.gender) {
        return -1;
      } else {
        return 0;
      }
    });
  }
};

const sortCharactersByHeight = (characterArr, orderBy) => {
  if (orderBy === 'asc') {
    return characterArr.sort((a, b) => {
      if (parseInt(a.heightInCm) > parseInt(b.heightInCm)) {
        return 1;
      } else if (parseInt(b.heightInCm) > parseInt(a.heightInCm)) {
        return -1;
      } else {
        return 0;
      }
    });
  } else if (orderBy === 'desc') {
    return characterArr.sort((a, b) => {
      if (parseInt(b.heightInCm) > parseInt(a.heightInCm)) {
        return 1;
      } else if (parseInt(a.heightInCm) > parseInt(b.heightInCm)) {
        return -1;
      } else {
        return 0;
      }
    });
  }
};

function convertCmToFeet(n) {
  var realFeet = (n * 0.3937) / 12;
  var feet = Math.floor(realFeet);
  var inches = Math.round((realFeet - feet) * 12);
  return `${feet}ft and ${inches} inches`;
}

module.exports = {
  paginator,
  fetchCharacters,
  sortCharactersByName,
  sortCharactersByGender,
  sortCharactersByHeight,
  convertCmToFeet,
};
