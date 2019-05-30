import React from 'react';
import styles from './Search.module.scss';
import cn from 'classnames';
import Button from '../Button/Button';
import { MdNearMe, MdCached } from 'react-icons/md';
import Select from '../Select/Select';
import AppContext from '../../AppContext';
import Autocomplete from './Autocomplete';
import cx from 'classnames';
import { withRouter } from 'react-router';
import Modal from '../../Modal';
import { MdClose } from 'react-icons/md';
import GlobalLoader from '../Base/GlobalLoader';
import { debounce } from 'underscore';
import Pagination from '../Pagination/Pagination';

const API_KEY = process.env.REACT_APP_FOOD_API_KEY;

const API_REQ_HEADER = {
  method: 'GET',
  headers: new Headers({
    'user-key': API_KEY
  })
};

/** helper functions */
const normalizeString = str =>
  str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace('ł', 'l'); // @toDo --- temporary

/** Component */
class SearchBase extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      globalLoader: false,
      loadingGeolocation: false,
      geolocationCoords: {},
      queryCity: '',
      cityAutocompleteMatches: [],
      cityData: {},
      restaurantsCountStart: 0,
      restaurants: [],
      cuisines: [],
      categories: [],
      categoryID: '',
      showModal: false,
      modalText: ''
    };

    this.handleCityChangeDebounced = debounce(this.getCityData, 200);
  }
  componentDidMount() {
    this.getCategories();
  }

  getCategories = () => {
    fetch(`https://developers.zomato.com/api/v2.1/categories`, API_REQ_HEADER)
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

  getGeolocation = () => {
    if (navigator.geolocation) {
      this.setState({
        loadingGeolocation: true
      });

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
      if (error.code === 2) {
        this.setState({
          geolocationCoords: {},
          showModal: true,
          modalText: 'You need to allow geolocation in device browser settings',
          loadingGeolocation: false
        });
      } else {
        this.setState({
          geolocationCoords: {},
          showModal: true,
          modalText: 'You need to allow geolocation in device browser settings',
          loadingGeolocation: false
        });
      }
    }
  };

  getCityName = () => {
    fetch(
      `https://developers.zomato.com/api/v2.1/geocode?lat=${
        this.state.geolocationCoords.latitude
      }&lon=${this.state.geolocationCoords.longitude}`,
      API_REQ_HEADER
    )
      .then(data => data.json())
      .then(res => {
        this.setState({
          queryCity: res.location.city_name,
          cityData: {
            name: res.location.city_name,
            id: res.location.city_id
          },
          loadingGeolocation: false
        });
      })
      .catch(err => {
        console.log(err);
      });
  };

  handleCityChange = e => {
    this.setState({
      queryCity: e.target.value
    });

    this.handleCityChangeDebounced();
  };

  handleCategoryChange = event => {
    const ID = event.target[event.target.selectedIndex].dataset.id;

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

  getCityData = isFormSubmited => {
    if (this.state.queryCity.length >= 2) {
      console.log(normalizeString(this.state.queryCity));

      fetch(
        `https://developers.zomato.com/api/v2.1/cities?q=${normalizeString(
          this.state.queryCity
        )}`,
        API_REQ_HEADER
      )
        .then(data => data.json())
        .then(res => {
          const matchedLocations = res.location_suggestions;

          if (!isFormSubmited) {
            if (matchedLocations.length > 0) {
              const matches = matchedLocations.map(el => {
                return {
                  name: el.name,
                  id: el.id
                };
              });

              this.setState({
                cityAutocompleteMatches: matches
              });
            } else {
              this.setState({
                cityAutocompleteMatches: []
              });
            }
          } else {
            if (matchedLocations.length > 0) {
              this.setState(
                {
                  queryCity: matchedLocations[0].name,
                  cityData: {
                    name: matchedLocations[0].name,
                    id: matchedLocations[0].id
                  }
                },
                this.sendSearchRequest
              );
            } else {
              this.setState({
                globalLoader: false,
                showModal: true,
                modalText: 'No matches for provided City'
              });
            }
          }
        })
        .catch(err => {
          this.setState({
            globalLoader: false,
            showModal: true,
            modalText: err
          });
        });
    } else {
      this.setState({
        cityAutocompleteMatches: []
      });
    }
  };

  setCity = (e, isClickedOutside) => {
    if (!isClickedOutside) {
      this.setState({
        queryCity: e.target.dataset.name,
        cityAutocompleteMatches: []
      });
    } else {
      this.setState({
        cityAutocompleteMatches: []
      });
    }
  };

  handleFormSubmit = e => {
    e.preventDefault();

    if (this.state.queryCity) {
      this.setState(
        {
          globalLoader: true
        },
        /** getCityData(isFormSubmited) ---> boolean to inform that for has been submited */
        this.getCityData(true)
      );
    } else {
      this.setState({
        showModal: true,
        modalText: `You need to enter any city`
      });
    }
  };

  sendSearchRequest = (countStart = 0) => {
    const cuisineQuery = this.state.cuisineID
      ? `&cuisines=${this.state.cuisineID}`
      : '';
    const categoryQuery = this.state.categoryID
      ? `&category=${this.state.categoryID}`
      : '';

    if (this.state.cityData.id) {
      fetch(
        `https://developers.zomato.com/api/v2.1/search?entity_id=${
          this.state.cityData.id
        }&entity_type=city${cuisineQuery + categoryQuery}&start=${countStart}`,
        API_REQ_HEADER
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
            this.setState(
              {
                globalLoader: false,
                restaurantsCountStart: countStart
              },
              this.props.context.setFetchedRestaurants(restaurantsArr)
            );

            if (this.props.history.location.pathname !== '/')
              this.props.history.push('/');
          } else {
            this.setState({
              globalLoader: false,
              showModal: true,
              modalText: 'No matches found for provided data'
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
    } else {
      this.setState({
        globalLoader: false,
        modalText: 'No matches found for provided City',
        showModal: true
      });
    }
  };

  navigateThroughResults = (e, direction) => {
    const newCount =
      direction === 'next'
        ? this.state.restaurantsCountStart + 20
        : this.state.restaurantsCountStart - 20;

    if (newCount >= 0) {
      this.setState(
        {
          globalLoader: true
        },
        this.sendSearchRequest(newCount)
      );
    }
  };

  closeModal = () => {
    this.setState({
      queryCity: '',
      modalText: '',
      showModal: false
    });
  };

  render() {
    const {
      globalLoader,
      loadingGeolocation,
      queryCity,
      cityAutocompleteMatches,
      categories,
      showModal,
      modalText
    } = this.state;

    return (
      <AppContext.Consumer>
        {context => (
          <>
            {globalLoader && <GlobalLoader />}
            <div className={styles.wrapper}>
              <form
                method="POST"
                action=""
                className={styles.form}
                onSubmit={this.handleFormSubmit}
              >
                <div className={cx(styles.formGroup, styles.formGroupCity)}>
                  <button
                    type="button"
                    onClick={this.getGeolocation}
                    className={styles.btnGeolocation}
                  >
                    {!loadingGeolocation ? (
                      <MdNearMe />
                    ) : (
                      <span className={styles.btnGeolocationLoader}>
                        <MdCached />
                      </span>
                    )}
                  </button>
                  <input
                    type="text"
                    placeholder="Enter city name..."
                    value={queryCity}
                    onChange={this.handleCityChange}
                    disabled={loadingGeolocation}
                    className={cn(styles.formInput, styles.formInputLocation)}
                  />
                  {cityAutocompleteMatches.length > 0 && (
                    <Autocomplete
                      items={cityAutocompleteMatches}
                      setCityFn={this.setCity}
                    />
                  )}
                </div>
                <div className={styles.selectWrapper}>
                  <Select
                    dataType="categories"
                    onChangeFn={this.handleCategoryChange}
                    items={categories}
                  />
                </div>
                <Button submit>Search</Button>
              </form>
            </div>

            {this.props.history.location.pathname === '/' &&
            this.props.context.restaurants.length > 0 ? (
              <Pagination paginationFn={this.navigateThroughResults} />
            ) : null}

            {showModal && (
              <Modal>
                <div className={styles.modal}>
                  <div className={styles.modalInner}>
                    <button
                      className={styles.modalButton}
                      onClick={this.closeModal}
                    >
                      <MdClose size={30} color="#fff" />
                    </button>
                    <h3 className={styles.modalText}>{modalText}</h3>
                  </div>
                </div>
              </Modal>
            )}
          </>
        )}
      </AppContext.Consumer>
    );
  }
}
const SearchWithRouter = withRouter(SearchBase);

const Search = props => (
  <AppContext.Consumer>
    {context => <SearchWithRouter context={context} />}
  </AppContext.Consumer>
);

export default Search;
