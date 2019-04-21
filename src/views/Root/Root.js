import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import AppContext from '../../AppContext';
import Search from '../../components/Search/Search';
import Results from '../Results/Results';
import Restaurant from '../Restaurant/Restaurant';
import { debounce } from 'underscore';

import { restaurantsTEST } from '../../testData';

const API_KEY = process.env.REACT_APP_FOOD_API_KEY;

class Root extends Component {
  constructor(props) {
    super(props);

    this.state = {
      geolocationCoords: {},
      queryCity: '',
      cityData: {},
      // restaurants: [],
      restaurants: restaurantsTEST,
      cuisines: [],
      categories: [],
      categoryID: '',
      cuisineID: '',
      handleCityChange: this.handleCityChange,
      handleCategoryChange: this.handleCategoryChange,
      handleCuisineChange: this.handleCuisineChange,
      handleFormSubmit: this.handleFormSubmit,
      getGeolocation: this.getGeolocation
    };
  }

  getGeolocation = () => {
    if (navigator.geolocation) {
      const watcher = navigator.geolocation.getCurrentPosition(
        this.displayLocationInfo,
        this.handleLocationError
      );
    }
  };

  displayLocationInfo = position => {
    this.setState(
      {
        geolocationCoords: {
          longitude: position.coords.longitude,
          latitude: position.coords.latitude
        }
      },
      this.getCityName
    );
  };

  handleLocationError = error => {
    if (error.code) {
      this.setState({
        geolocationCoords: {},
        geoErrorMessage: error.message
      });
    }
  };

  getCityName = () => {
    fetch(
      `https://developers.zomato.com/api/v2.1/geocode?lat=${
        this.state.geolocationCoords.latitude
      }&lon=${this.state.geolocationCoords.longitude}`,
      {
        method: 'GET',
        headers: new Headers({
          'user-key': API_KEY
        })
      }
    )
      .then(data => data.json())
      .then(res => {
        this.setState({
          queryCity: res.location.city_name,
          cityData: {
            name: res.location.city_name,
            id: res.location.city_id
          }
        });
      })
      .catch(err => {
        console.log(err);
      });
  };

  handleCityChange = e => {
    e.persist();

    this.setState({
      queryCity: e.target.value
    });

    if (!this.handleCityChangeDebounced) {
      this.handleCityChangeDebounced = debounce(() => {
        this.getCityData();
      }, 1000);
    }

    this.handleCityChangeDebounced();
  };

  handleCategoryChange = e => {
    const ID = e.target[e.target.selectedIndex].dataset.id;

    this.setState({
      categoryID: ID
    });
  };

  handleCuisineChange = e => {
    const ID = e.target[e.target.selectedIndex].dataset.id;

    this.setState({
      cuisineID: ID
    });
  };

  getCityData = () => {
    if (this.state.queryCity) {
      fetch(
        `https://developers.zomato.com/api/v2.1/cities?q=${
          this.state.queryCity
        }`,
        {
          method: 'GET',
          headers: new Headers({
            'user-key': API_KEY
          })
        }
      )
        .then(data => data.json())
        .then(res => {
          const matchedLocations = res.location_suggestions;

          if (matchedLocations.length > 0) {
            const cityData = {
              name: matchedLocations[0].name,
              id: matchedLocations[0].id
            };

            this.setState(
              {
                queryCity: cityData.name,
                cityData: cityData
              },
              this.getCuisines
            );
          } else {
            this.setState({
              queryCity: '',
              cityData: {}
            });
            alert('Podana fraza nie pasuje do zadnej lokalizacji...');
          }
        })
        .catch(err => {
          console.log(err);
        });
    } else {
      this.setState({
        cityData: {},
        cuisineID: '',
        cuisines: []
      });
    }
  };

  getCuisines = () => {
    if (this.state.cityData.id) {
      fetch(
        `https://developers.zomato.com/api/v2.1/cuisines?city_id=${
          this.state.cityData.id
        }`,
        {
          method: 'GET',
          headers: new Headers({
            'user-key': API_KEY
          })
        }
      )
        .then(data => data.json())
        .then(res => {
          console.log(res);
          this.setState({
            cuisines: res.cuisines
          });
        })
        .catch(err => {
          console.log(err);
        });
    }
  };

  handleFormSubmit = e => {
    e.preventDefault();

    if (
      !(
        Object.keys(this.state.cityData).length === 0 &&
        this.state.cityData.constructor === Object
      )
    ) {
      this.sendSearchRequest();
    } else {
      this.getCityData();
    }
  };

  sendSearchRequest = () => {
    const cuisineQuery = this.state.cuisineID
      ? `&cuisines=${this.state.cuisineID}`
      : '';
    const categoryQuery = this.state.categoryID
      ? `&category=${this.state.categoryID}`
      : '';

    console.log(
      `https://developers.zomato.com/api/v2.1/search?entity_id=${
        this.state.cityData.id
      }&entity_type=city${cuisineQuery + categoryQuery}`
    );

    if (this.state.cityData.id) {
      fetch(
        `https://developers.zomato.com/api/v2.1/search?entity_id=${
          this.state.cityData.id
        }&entity_type=city${cuisineQuery + categoryQuery}`,
        {
          method: 'GET',
          headers: new Headers({
            'user-key': API_KEY
          })
        }
      )
        .then(data => data.json())
        .then(res => {
          console.log(res);
          const restaurantsArr = res.restaurants.map(item => {
            const restaurant = item.restaurant;
            return {
              id: restaurant.id,
              name: restaurant.name,
              city: restaurant.location.city,
              address: restaurant.location.address,
              area: restaurant.location.locality_verbose,
              img: restaurant.thumb
                ? restaurant.thumb
                : restaurant.featured_image,
              cuisines: restaurant.cuisines,
              currency: restaurant.currency,
              costForTwo: restaurant.average_cost_for_two,
              ratingNumber: restaurant.user_rating.agerate_rating,
              ratingColor: restaurant.user_rating.rating_color,
              ratingText: restaurant.user_rating.rating_text,
              votes: restaurant.user_rating.votes
            };
          });

          if (restaurantsArr.length > 0) {
            this.setState({
              restaurants: restaurantsArr
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  };

  render() {
    return (
      <BrowserRouter>
        <AppContext.Provider value={this.state}>
          <div className="App">
            <Search />
            <Switch>
              <Route exact path="/" component={Results} />
              <Route path="/restaurant/:id" component={Restaurant} />
            </Switch>
          </div>
        </AppContext.Provider>
      </BrowserRouter>
    );
  }
}

export default Root;
