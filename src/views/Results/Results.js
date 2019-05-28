import React from 'react';
import AppContext from '../../AppContext';
import Search from '../../components/Search/Search';
import List from '../../components/Card/List';
import Pagination from '../../components/Pagination/Pagination';

const API_KEY = process.env.REACT_APP_FOOD_API_KEY;

const Results = props => (
  <AppContext.Consumer>
    {context => (
      <>
        <Search history={props.history} />
        {context.restaurants.length > 0 && (
          <>
            <List items={context.restaurants} />
            <Pagination paginationFn={context.navigateThroughResults} />
          </>
        )}
      </>
    )}
  </AppContext.Consumer>
);

export default Results;
