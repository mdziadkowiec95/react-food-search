import React from 'react';
import { AuthUserContext } from '../Session';
import { withFirebase } from '../Firebase';
import AppContext from '../../AppContext';
import styles from './Details.module.scss';

const API_KEY = process.env.REACT_APP_FOOD_API_KEY;

class DetailsBase extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isFav: null
    };
  }

  componentDidMount() {
    this.getRestaurantDetails();
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
        this.setState(
          {
            details: res
          },
          this.checkFavoriteStatus
        );
      })
      .catch(err => {
        console.log(err);
      });
  }

  checkFavoriteStatus = () => {
    const isFavStatus = this.props.isFavFn(this.props.id);

    this.setState({
      isFav: isFavStatus
    });
  };

  handleToggleFavorite = (event, authUser) => {
    event.preventDefault();
    const { name, location, thumb } = this.state.details;

    const img = thumb ? thumb : '';

    // push new fav item to database
    this.props.firebase.favorite(authUser.uid).push({
      favID: this.props.id,
      name: name,
      city: location.city,
      img: img
    });
  };

  render() {
    const { id, authUser } = this.props;

    return (
      <>
        {this.state.isFav === null ? (
          <h4>loading...</h4>
        ) : (
          <h4>{this.state.isFav ? 'Remove from fav' : 'Add to favorites'}</h4>
        )}
        <hr />
        <div>{this.props.id}</div>
        <button onClick={event => this.handleToggleFavorite(event, authUser)}>
          Like
        </button>
      </>
    );
  }
}

const DetailsFb = withFirebase(DetailsBase);

const Details = props => (
  <AuthUserContext.Consumer>
    {authUser => (
      <AppContext.Consumer>
        {context => (
          <DetailsFb
            authUser={authUser}
            id={props.id}
            isFavFn={context.isFav}
          />
        )}
      </AppContext.Consumer>
    )}
  </AuthUserContext.Consumer>
);

export default Details;
