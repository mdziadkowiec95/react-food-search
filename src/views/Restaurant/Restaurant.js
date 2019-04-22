import React from 'react';
import AppContext from '../../AppContext';
import Search from '../../components/Search/Search';
import Details from '../../components/Details/Details';

const Restaurant = props => (
  <div>
    <Search history={props.history} />
    <Details id={props.match.params.id} />
  </div>
);

export default Restaurant;
