import React from 'react';

const AppContext = React.createContext({
  geolocationCoords: {},
  queryCity: '',
  cityData: {},
  restaurants: [],
  cuisines: [],
  categories: [],
  categoryID: '',
  cuisineID: '',
  handleCityChange() {},
  handleCategoryChange() {},
  handleCuisineChange() {},
  handleFormSubmit() {},
  getGeolocation() {}
});

export default AppContext;
