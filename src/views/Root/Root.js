import React, { Component } from 'react';
import styles from './Root.module.scss';
import { BrowserRouter, Route, Switch, Link } from 'react-router-dom';
import { withFirebase } from '../../components/Firebase';
import AppContext from '../../AppContext';
import { withAuthentication } from '../../components/Session';
import Navigation from '../../components/Navigation/Navigation';
import Sidebar from '../../components/Sidebar/Sidebar';
import Results from '../Results/Results';
import RestaurantView from '../RestaurantView/RestaurantView';
import SignUpView from '../SignUpView/SignUpView';
import SignInView from '../SignInView/SignInView';
import AccountView from '../AccountView/AccountView';
import PasswordForgetView from '../PasswordForgetView/PasswordForgetView';
import Modal from '../../Modal';
import { CircleSpinner } from 'react-spinners-kit';
import { debounce } from 'underscore';

import { restaurantsTEST } from '../../testData';

const cityAutocompleteMatchesTEST = [
  {
    name: 'City 1',
    id: 1230
  },
  {
    name: 'City 28',
    id: 1238
  },
  {
    name: 'City 3',
    id: 1237
  },
  {
    name: 'City 4',
    id: 1235
  },
  {
    name: 'City 5',
    id: 1231
  }
];

const API_KEY = process.env.REACT_APP_FOOD_API_KEY;

class Root extends Component {
  constructor(props) {
    super(props);

    this.state = {
      authUser: null,
      globalLoader: false,
      loadingGeolocation: false,
      geolocationCoords: {},
      queryCity: '',
      cityAutocompleteMatches: [...cityAutocompleteMatchesTEST],
      cityData: {},
      restaurants: [],
      restaurants: restaurantsTEST,
      cuisines: [],
      categories: [],
      categoryID: '',
      cuisineID: '',
      favList: [],
      isSidebarOpen: false,
      showModal: true,
      handleCityChange: this.handleCityChange,
      setCity: this.setCity,
      handleCategoryChange: this.handleCategoryChange,
      handleCuisineChange: this.handleCuisineChange,
      handleFormSubmit: this.handleFormSubmit,
      getGeolocation: this.getGeolocation,
      handleToggleSidebar: this.handleToggleSidebar
    };
  }

  componentDidMount() {
    // *** Authorization listener ***
    this.listenerAuth = this.props.firebase.auth.onAuthStateChanged(
      authUser => {
        authUser
          ? this.setState({ authUser })
          : this.setState({ authUser: null });
      }
    );

    this.getCategories();
  }

  componentWillUnmount() {
    this.listenerAuth();
    // this.listenerFavorites();
  }

  runFavoritesListener = () => {
    // *** Favorites listener ***
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
      this.setState({
        geolocationCoords: {},
        geoErrorMessage: error.message,
        loadingGeolocation: false
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
          },
          loadingGeolocation: false
        });
      })
      .catch(err => {
        console.log(err);
      });
  };

  handleCityChange = e => {
    // e.persist();

    this.setState({
      queryCity: e.target.value
    });

    if (!this.handleCityChangeDebounced) {
      this.handleCityChangeDebounced = debounce(this.getCityData, 300);
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

  getCityData = getFirstMatch => {
    if (this.state.queryCity) {
      const queryNormalized = this.state.queryCity
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace('ł', 'l'); // @toDo --- temporary

      console.log(queryNormalized);

      fetch(
        `https://developers.zomato.com/api/v2.1/cities?q=${queryNormalized}`,
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

          if (!getFirstMatch) {
            if (matchedLocations.length > 0) {
              const matches = matchedLocations.map(el => {
                return {
                  name: el.name,
                  id: el.id
                };
              });
              console.log(matches);

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
              alert('No results for the city');
            }
          }
        })
        .catch(err => {
          console.log(err);
        });
    } else {
      this.setState({
        cityAutocompleteMatches: []
      });
    }
  };

  setCity = (event, isClickedOutside, id, name) => {
    if (!isClickedOutside) {
      this.setState(
        {
          queryCity: name,
          cityAutocompleteMatches: []
        },
        this.getCuisines
      );
    } else {
      this.setState({
        cityAutocompleteMatches: []
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

  handleFormSubmit = (e, history) => {
    e.preventDefault();

    history.push('/');

    this.getCityData(true);
  };

  sendSearchRequest = () => {
    this.setState({
      globalLoader: true
    });

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
            this.setState(
              {
                cityData: {},
                restaurants: restaurantsArr,
                globalLoader: false
              },
              this.getCuisines
            );
          } else {
            this.setState({
              restaurants: [],
              globalLoader: false
            });
            alert('Brak dopasowań... :-(');
          }
        })
        .catch(err => {
          console.log(err);
        });
    } else {
      this.setState({
        globalLoader: false,
        showModal: true
      });
    }
  };

  closeModal = () => {
    this.setState({
      queryCity: '',
      showModal: false
    });
  };

  handleToggleSidebar = () => {
    this.setState(state => ({
      isSidebarOpen: !state.isSidebarOpen
    }));

    // if (!this.state.isSidebarOpen) {
    //   this.setState({ isSidebarOpen: true });
    // } else {
    //   this.setState({ isSidebarOpen: false });
    // }
  };

  render() {
    return (
      <BrowserRouter>
        <AppContext.Provider value={this.state}>
          <div className="App">
            <Navigation />
            {<Sidebar delayTime={500} isMounted={this.state.isSidebarOpen} />}
            <Switch>
              <Route exact path="/" component={Results} />
              <Route path="/sign-up" component={SignUpView} />
              <Route path="/sign-in" component={SignInView} />
              <Route path="/account" component={AccountView} />
              <Route path="/password-forget" component={PasswordForgetView} />
              <Route path="/restaurant/:id" component={RestaurantView} />
            </Switch>
            <div className={styles.globalSpinner}>
              <CircleSpinner
                size={60}
                color="#e67e22"
                loading={this.state.globalLoader}
              />
            </div>
            {this.state.showModal && (
              <Modal>
                <div className={styles.modal}>
                  <button onClick={this.closeModal}>x</button>
                  <h3>No such a city</h3>
                </div>
              </Modal>
            )}
          </div>
        </AppContext.Provider>
      </BrowserRouter>
    );
  }
}

export default withAuthentication(Root);
