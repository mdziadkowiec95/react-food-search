import React from 'react';
import AppContext from '../../AppContext';
import Search from '../../components/Search/Search';
import List from '../../components/Card/List';

const API_KEY = process.env.REACT_APP_FOOD_API_KEY;

const Results = props => (
  <AppContext.Consumer>
    {context => (
      <>
        {context.restaurants.length > 0 && (
          <>
            <List items={context.restaurants} />
          </>
        )}
      </>
    )}
  </AppContext.Consumer>
);

export default Results;
