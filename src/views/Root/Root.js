import React, { Component } from 'react';
import styles from './Root.module.scss';
import { BrowserRouter, Route, Switch, Link } from 'react-router-dom';
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
import GlobalLoader from '../../components/Base/GlobalLoader';
import { debounce } from 'underscore';
import { MdClose } from 'react-icons/md';
import { restaurantsTEST } from '../../testData';

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
      cityAutocompleteMatches: [],
      cityData: {},
      restaurantsCountStart: 0,
      restaurants: [],
      cuisines: [],
      categories: [],
      categoryID: '',
      cuisineID: '',
      favList: [],
      isSidebarOpen: false,
      isNavOpen: false,
      showModal: false,
      modalText: 'font-size: 16px; font-size: 16px;',
      handleCityChange: this.handleCityChange,
      navigateThroughResults: this.navigateThroughResults,
      setCity: this.setCity,
      handleCategoryChange: this.handleCategoryChange,
      handleCuisineChange: this.handleCuisineChange,
      handleFormSubmit: this.handleFormSubmit,
      getGeolocation: this.getGeolocation,
      handleToggleSidebar: this.handleToggleSidebar,
      handleToggleNav: this.handleToggleNav
    };

    this.handleCityChangeDebounced = debounce(this.getCityData, 200);
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
    // alert(error.message + error.code);
    if (error.code) {
      if (error.code === 2) {
        this.setState({
          geolocationCoords: {},
          // geoErrorMessage: '',
          showModal: true,
          modalText: 'You need to allow geolocation in device browser settings',
          loadingGeolocation: false
        });
      } else {
        this.setState({
          geolocationCoords: {},
          showModal: true,
          modalText: error.message,
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

  getCityData = getFirstMatch => {
    if (this.state.queryCity.length >= 2) {
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
              this.setState({
                showModal: true,
                modalText: 'No matches for provided City',
                globalLoader: false
              });
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

    if (this.state.queryCity) {
      this.setState({
        globalLoader: true
      });

      this.getCityData(true);
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

    console.log(
      `https://developers.zomato.com/api/v2.1/search?entity_id=${
        this.state.cityData.id
      }&entity_type=city${cuisineQuery + categoryQuery}&start=${countStart}`
    );

    if (this.state.cityData.id) {
      fetch(
        `https://developers.zomato.com/api/v2.1/search?entity_id=${
          this.state.cityData.id
        }&entity_type=city${cuisineQuery + categoryQuery}&start=${countStart}`,
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
                globalLoader: false,
                restaurantsCountStart: countStart,
                restaurants: restaurantsArr
              },
              this.getCuisines
            );
          } else {
            this.setState({
              globalLoader: false,
              restaurantsCountStart: countStart - 20,
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
    } else {
      // this.setState({
      //   restaurantsCountStart: 0
      // });
    }
  };

  closeModal = () => {
    this.setState({
      queryCity: '',
      modalText: '',
      showModal: false
    });
  };

  handleToggleSidebar = () => {
    this.setState(state => ({
      isSidebarOpen: !state.isSidebarOpen
    }));
  };

  handleToggleNav = () => {
    this.setState(state => ({
      isNavOpen: !state.isNavOpen
    }));
  };

  render() {
    return (
      <BrowserRouter>
        <AppContext.Provider value={this.state}>
          <div className="App">
            <Navigation />
            {<Sidebar delayTime={300} isMounted={this.state.isSidebarOpen} />}
            <Switch>
              <Route exact path="/" component={Results} />
              <Route path="/sign-up" component={SignUpView} />
              <Route path="/sign-in" component={SignInView} />
              <Route path="/account" component={AccountView} />
              <Route path="/password-forget" component={PasswordForgetView} />
              <Route path="/restaurant/:id" component={RestaurantView} />
            </Switch>

            {this.state.globalLoader && <GlobalLoader />}

            {this.state.showModal && (
              <Modal>
                <div className={styles.modal}>
                  <div className={styles.modalInner}>
                    <button
                      className={styles.modalButton}
                      onClick={this.closeModal}
                    >
                      <MdClose size={30} color="#fff" />
                    </button>
                    <h3 className={styles.modalText}>{this.state.modalText}</h3>
                  </div>
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
