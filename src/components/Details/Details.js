import React from 'react';
import styles from './Details.module.scss';

const API_KEY = process.env.REACT_APP_FOOD_API_KEY;

class Details extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
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
        // this.setState({
        //   details: res.categories
        // });
      })
      .catch(err => {
        console.log(err);
      });
  }

  render() {
    return <div>{this.props.id}</div>;
  }
}

export default Details;
