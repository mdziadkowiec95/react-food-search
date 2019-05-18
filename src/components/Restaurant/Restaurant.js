import React from 'react';
import { AuthUserContext } from '../Session';
import { withFirebase } from '../Firebase';
import styles from './Restaurant.module.scss';
import thumbPlaceholder from '../../assets/images/thumb-placeholder.jpg';
import Details from './Details';
import LikeButton from './LikeButton';
import Spinner from '../Base/Spinner';
import { CircleSpinner } from 'react-spinners-kit';

const API_KEY = process.env.REACT_APP_FOOD_API_KEY;

class RestaurantBase extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      details: {},
      favList: [],
      isFav: null,
      uniqueID: ''
    };
  }

  componentDidMount() {
    this.getRestaurantDetails();

    if (this.props.authUser) {
      this.checkFavCollection();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.id !== prevProps.id) {
      this.getRestaurantDetails();
      this.setFavoriteStatus();
    }
  }

  componentWillUnmount() {
    this.props.firebase.favorites().off();
  }

  checkFavCollection() {
    this.props.firebase.favorites().once('value', snapshot => {
      const favObject = snapshot.val();

      if (favObject) {
        const userFavItems = favObject[this.props.authUser.uid];
        let favListArr = [];

        if (userFavItems) {
          const userFavItemsKeys = Object.keys(
            favObject[this.props.authUser.uid]
          );

          /** Create favList array with favorite items */
          userFavItemsKeys.map(key => {
            favListArr.push({
              uniqueID: key,
              favID: userFavItems[key].favID
            });
          });

          console.log(favListArr);

          this.setState(
            {
              favList: favListArr,
              loading: false
            },
            this.setFavoriteStatus
          );
        } else {
          alert('undefined');
          this.setState({
            favList: [],
            loading: false,
            isFav: false,
            uniqueID: null
          });
        }
      } else {
        this.setState({
          favList: [],
          loading: false,
          isFav: false,
          uniqueID: null
        });
      }
    });
  }

  getRestaurantDetails() {
    fetch(
      `https://developers.zomato.com/api/v2.1/restaurant?res_id=${
        this.props.id
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

        const result = {
          id: res.id,
          url: res.url,
          name: res.name,
          city: res.location.city,
          address: res.location.address,
          area: res.location.locality_verbose,
          img: {
            full: res.featured_image,
            thumb: res.thumb
          },
          cuisines: res.cuisines,
          currency: res.currency,
          costForTwo: res.average_cost_for_two,
          ratingNumber: res.user_rating.aggregate_rating,
          ratingColor: res.user_rating.rating_color,
          ratingText: res.user_rating.rating_text,
          votes: res.user_rating.votes
        };

        console.log(result);

        this.setState({
          details: result
        });
      })
      .catch(err => {
        console.log(err);
      });
  }

  checkFavStatus = id => {
    console.log(this.state);
    if (this.state.favList.length > 0) {
      const index = this.state.favList.findIndex(el => el.favID === id);
      const isFav = index !== -1 ? true : false;

      console.log(isFav);

      return {
        isFav: isFav,
        uniqueID: isFav ? this.state.favList[index].uniqueID : null
      };
    } else {
      return {
        isFav: false,
        uniqueID: null
      };
    }
  };

  setFavoriteStatus = () => {
    const isFavStatus = this.checkFavStatus(this.props.id);

    this.setState({
      ...isFavStatus
    });
  };

  handleToggleFavorite = (event, isFav) => {
    const { firebase, authUser, id } = this.props;
    event.preventDefault();

    if (!isFav) {
      const { name, city, img } = this.state.details;

      const imageUrl = img.thumb ? img.thumb : thumbPlaceholder;

      /** push new fav item to database */
      firebase.favorite(authUser.uid).push({
        favID: id,
        name: name,
        city: city,
        img: imageUrl
      });

      this.checkFavCollection();
    } else {
      firebase
        .favorite(authUser.uid)
        .child(this.state.uniqueID)
        .remove();

      this.setState({
        isFav: false,
        uniqueID: null
      });
    }
  };

  render() {
    const { id, authUser } = this.props;

    if (!authUser) {
      return (
        <div className={styles.wrapper}>
          <h4>Sign in to like the restaurant</h4>
          <Details {...this.state.details} />
        </div>
      );
    }

    if (authUser) {
      return (
        <div className={styles.wrapper}>
          {this.state.isFav === null ? (
            <Spinner
              className={styles.spinner}
              loading={!this.state.favListFetched}
            />
          ) : (
            <LikeButton
              isFav={this.state.isFav}
              toggleIsFavFn={this.handleToggleFavorite}
            />
          )}
          <Details {...this.state.details} />
          <hr />
        </div>
      );
    }
  }
}

const RestaurantFb = withFirebase(RestaurantBase);

const Restaurant = props => (
  <AuthUserContext.Consumer>
    {authUser => <RestaurantFb authUser={authUser} id={props.id} />}
  </AuthUserContext.Consumer>
);

export default Restaurant;