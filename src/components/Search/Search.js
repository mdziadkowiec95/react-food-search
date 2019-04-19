import React from 'react';
import styles from './Search.module.scss';
import Button from '../Button/Button';
import { MdNearMe } from 'react-icons/md';
import styled from 'styled-components';
// import { LocationDisabled } from 'styled-icons/material'
import { Lock } from 'styled-icons/material';
import { debounce } from 'underscore';

const API_KEY = process.env.REACT_APP_FOOD_API_KEY;

class Search extends React.Component {
  state = {
    geolocationCoords: {},
    queryCity: '',
    cityData: {}
  };

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

            this.setState({
              queryCity: cityData.name,
              cityData: cityData
            });
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
    console.log(
      `https://developers.zomato.com/api/v2.1/search?entity_id=${
        this.state.cityData.id
      }&entity_type=city`
    );

    if (this.state.cityData.id) {
      fetch(
        `https://developers.zomato.com/api/v2.1/search?entity_id=${
          this.state.cityData.id
        }&entity_type=city`,
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
        })
        .catch(err => {
          console.log(err);
        });
    }
  };

  render() {
    return (
      <form
        method="POST"
        action=""
        className={styles.form}
        onSubmit={this.handleFormSubmit}
      >
        {JSON.stringify(this.state, null, 0)}
        <div className={styles.formGroup}>
          <button
            type="button"
            onClick={this.getGeolocation}
            className={styles.formButton}
          >
            <MdNearMe />
          </button>
          <input
            type="text"
            value={this.state.queryCity}
            onChange={this.handleCityChange}
            className={styles.formInput}
          />
        </div>
        <Button submit>Search</Button>
      </form>
    );
  }
}

export default Search;
