import React from 'react';
import { withRouter } from 'react-router-dom';
import { AuthUserContext } from '../Session';
import { withFirebase } from '../Firebase';
import AppContext from '../../AppContext';
import styles from './Details.module.scss';
import thumbPlaceholder from '../../assets/images/thumb-placeholder.jpg';

const API_KEY = process.env.REACT_APP_FOOD_API_KEY;

class DetailsBase extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
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
          // Create favList array with favorite items
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
            this.checkFavoriteStatus
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
        this.setState({
          details: res
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

  checkFavoriteStatus = () => {
    const isFavStatus = this.checkFavStatus(this.props.id);

    this.setState({
      ...isFavStatus
    });
  };

  handleToggleFavorite = (event, authUser, isFav) => {
    event.preventDefault();

    if (!isFav) {
      const { name, location, thumb } = this.state.details;

      const img = thumb ? thumb : thumbPlaceholder;

      // push new fav item to database
      this.props.firebase.favorite(authUser.uid).push({
        favID: this.props.id,
        name: name,
        city: location.city,
        img: img
      });

      this.checkFavCollection();
    } else {
      this.props.firebase
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
        <>
          <h4>Sign in to like the restaurant</h4>
        </>
      );
    }

    if (authUser) {
      return (
        <>
          {this.state.isFav === null ? (
            <h4>loading...</h4>
          ) : (
            <button
              onClick={event =>
                this.handleToggleFavorite(event, authUser, this.state.isFav)
              }
            >
              {this.state.isFav ? 'Unlike' : 'Like'}
            </button>
          )}
          <hr />
        </>
      );
    }

    return <div>{this.props.id}asfasf</div>;
  }
}

const DetailsFb = withFirebase(DetailsBase);

const Details = props => (
  <AuthUserContext.Consumer>
    {authUser => <DetailsFb authUser={authUser} id={props.id} />}
  </AuthUserContext.Consumer>
);

export default Details;
