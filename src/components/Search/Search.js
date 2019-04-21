import React from 'react';
import styles from './Search.module.scss';
import cn from 'classnames';
import Button from '../Button/Button';
import { MdNearMe } from 'react-icons/md';
import Select from '../Select/Select';
import AppContext from '../../AppContext';

const API_KEY = process.env.REACT_APP_FOOD_API_KEY;

class Search extends React.Component {
  state = {
    categories: []
  };

  componentDidMount() {
    this.getCategories();
  }

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

  render() {
    return (
      <AppContext.Consumer>
        {context => (
          <>
            <div className={styles.wrapper}>
              <form
                method="POST"
                action=""
                className={styles.form}
                onSubmit={context.handleFormSubmit}
              >
                <div className={styles.JSON}>
                  {/* {JSON.stringify(this.state, null, 0)} */}
                </div>

                <div className={styles.formGroup}>
                  <button
                    type="button"
                    onClick={context.getGeolocation}
                    className={styles.btnLocation}
                  >
                    <MdNearMe />
                  </button>
                  {/* {console.log(context)} */}
                  <input
                    type="text"
                    placeholder="Enter city name..."
                    value={context.queryCity}
                    onChange={context.handleCityChange}
                    className={cn(styles.formInput, styles.formInputLocation)}
                  />
                </div>
                <div className={styles.selectWrapper}>
                  <Select
                    dataType="categories"
                    onChangeFn={context.handleCategoryChange}
                    items={this.state.categories}
                  />
                  <Select
                    dataType="cuisine"
                    onChangeFn={context.handleCuisineChange}
                    items={context.cuisines}
                  />
                </div>
                <Button submit>Search</Button>
              </form>
            </div>
            {/* <div>
              {context.restaurants &&
                context.restaurants.map(item => console.log(item.name))}
            </div> */}
          </>
        )}
      </AppContext.Consumer>
    );
  }
}

export default Search;
