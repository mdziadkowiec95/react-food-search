import React from 'react';
import Search from '../../components/Search/Search';
import Details from '../../components/Details/Details';
import styles from './Restaurant.module.scss';

const Restaurant = props => (
  <div>
    <Search history={props.history} />
    <div className={styles.wrapper}>
      <Details id={props.match.params.id} />
    </div>
  </div>
);

export default Restaurant;
