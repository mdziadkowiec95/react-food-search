import React from 'react';
import styles from './Search.module.scss';
import cn from 'classnames';
import Button from '../Button/Button';
import { MdNearMe } from 'react-icons/md';
import { debounce } from 'underscore';
import Select from '../Select/Select';
import Card from '../Card/Card';

const API_KEY = process.env.REACT_APP_FOOD_API_KEY;

class Search extends React.Component {
  state = {
    geolocationCoords: {},
    queryCity: '',
    cityData: {},
    restaurants: [],
    cuisines: [],
    categories: [],
    categoryID: '',
    cuisineID: ''
  };

  componentDidMount() {
    this.getCategories();
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

  getCategories = () => {
    fetch(`https://developers.zomato.com/api/v2.1/categories`, {
      method: 'GET',
      headers: new Headers({
        'user-key': API_KEY
      })
    })
      .then(data => data.json())
      .then(res => {
        console.log(res);
        this.setState({
          categories: res.categories
        });
      })
      .catch(err => {
        console.log(err);
      });
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
              img: {
                thumb: restaurant.thumb,
                full: restaurant.featured_image
              },
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
    const { restaurants } = this.state;
    return (
      <>
        <div className={styles.wrapper}>
          <form
            method="POST"
            action=""
            className={styles.form}
            onSubmit={this.handleFormSubmit}
          >
            <div className={styles.JSON}>
              {/* {JSON.stringify(this.state, null, 0)} */}
            </div>

            <div className={styles.formGroup}>
              <button
                type="button"
                onClick={this.getGeolocation}
                className={styles.btnLocation}
              >
                <MdNearMe />
              </button>
              <input
                type="text"
                placeholder="Enter city name..."
                value={this.state.queryCity}
                onChange={this.handleCityChange}
                className={cn(styles.formInput, styles.formInputLocation)}
              />
            </div>
            <div className={styles.selectWrapper}>
              <Select
                dataType="categories"
                onChangeFn={this.handleCategoryChange}
                items={this.state.categories}
              />
              <Select
                dataType="cuisine"
                onChangeFn={this.handleCuisineChange}
                items={this.state.cuisines}
              />
            </div>
            <Button submit>Search</Button>
          </form>
        </div>
        <div>{restaurants && restaurants.map(item => <Card {...item} />)}</div>
      </>
    );
  }
}

export default Search;
