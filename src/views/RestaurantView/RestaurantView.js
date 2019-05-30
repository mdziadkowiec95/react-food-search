import React from 'react';
import Search from '../../components/Search/Search';
import Details from '../../components/Restaurant/Restaurant';
import styles from './RestaurantView.module.scss';

const RestaurantView = props => (
  <div>
    <div className={styles.wrapper}>
      <Details id={props.match.params.id} />
    </div>
  </div>
);

export default RestaurantView;
