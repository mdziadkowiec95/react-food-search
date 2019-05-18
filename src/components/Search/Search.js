import React from 'react';
import styles from './Search.module.scss';
import cn from 'classnames';
import Button from '../Button/Button';
import { MdNearMe, MdCached } from 'react-icons/md';
import Select from '../Select/Select';
import AppContext from '../../AppContext';
import Autocomplete from './Autocomplete';
import cx from 'classnames';
// import cities from 'cities.json';

const API_KEY = process.env.REACT_APP_FOOD_API_KEY;

const citiesEndpoint =
  'https://gist.githubusercontent.com/Miserlou/c5cd8364bf9b2420bb29/raw/2bf258763cdddd704f8ffd3ea9a3e81d25e2c6f6/cities.json';

class Search extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      categories: []
    };
  }

  componentDidMount() {}

  render() {
    // console.log(this.props.history);
    return (
      <AppContext.Consumer>
        {context => (
          <>
            <div className={styles.wrapper}>
              <form
                method="POST"
                action=""
                className={styles.form}
                onSubmit={e => context.handleFormSubmit(e, this.props.history)}
              >
                <div className={styles.JSON}>
                  {/* {JSON.stringify(this.state, null, 0)} */}
                </div>

                <div className={cx(styles.formGroup, styles.formGroupCity)}>
                  <button
                    type="button"
                    onClick={context.getGeolocation}
                    className={styles.btnGeolocation}
                  >
                    {!context.loadingGeolocation ? (
                      <MdNearMe />
                    ) : (
                      <span className={styles.btnGeolocationLoader}>
                        <MdCached />
                      </span>
                    )}
                  </button>
                  {/* {console.log(context)} */}
                  <input
                    type="text"
                    placeholder="Enter city name..."
                    value={context.queryCity}
                    onChange={context.handleCityChange}
                    className={cn(styles.formInput, styles.formInputLocation)}
                  />
                  {context.cityAutocompleteMatches.length > 0 && (
                    <Autocomplete items={context.cityAutocompleteMatches} />
                  )}
                </div>
                <div className={styles.selectWrapper}>
                  <Select
                    dataType="categories"
                    onChangeFn={context.handleCategoryChange}
                    items={context.categories}
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
