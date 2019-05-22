import React from 'react';
import AppContext from '../../AppContext';
import Search from '../../components/Search/Search';
import List from '../../components/Card/List';

const API_KEY = process.env.REACT_APP_FOOD_API_KEY;

const Results = props => (
  <AppContext.Consumer>
    {context => (
      <>
        <Search history={props.history} />
        {context.restaurants.length ? (
          <List items={context.restaurants} />
        ) : (
          'no results'
        )}
      </>
    )}
  </AppContext.Consumer>
);

export default Results;
