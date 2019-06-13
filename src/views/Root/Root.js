import React, { Component } from 'react';
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
// import Modal from '../../Modal';
// import { debounce } from 'underscore';
// import { restaurantsTEST } from '../../testData';
import Search from '../../components/Search/Search';

const API_KEY = process.env.REACT_APP_FOOD_API_KEY;
const API_REQ_HEADER = {
  method: 'GET',
  headers: new Headers({
    'user-key': API_KEY
  })
};

class Root extends Component {
  constructor(props) {
    super(props);

    this.state = {
      authUser: null,
      restaurants: [],
      isSidebarOpen: false,
      isNavOpen: false,
      showModal: false,
      modalText: 'font-size: 16px; font-size: 16px;'
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
  }

  componentWillUnmount() {
    this.listenerAuth();
  }

  setFetchedRestaurants = restaurantsArr => {
    this.setState({
      restaurants: restaurantsArr
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
    const AppContextElements = {
      ...this.state,
      setFetchedRestaurants: this.setFetchedRestaurants,
      handleToggleNav: this.handleToggleNav,
      handleToggleSidebar: this.handleToggleSidebar
    };
    return (
      <BrowserRouter>
        <AppContext.Provider value={AppContextElements}>
          <div className="App">
            <Search />
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
          </div>
        </AppContext.Provider>
      </BrowserRouter>
    );
  }
}

export default withAuthentication(Root);
