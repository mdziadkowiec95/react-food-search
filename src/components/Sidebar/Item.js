import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Item.module.scss';
import AppContext from '../../AppContext';

const Item = ({ name, favID, city, img }) => (
  <AppContext.Consumer>
    {context => (
      <li key={favID} className={styles.item}>
        <Link
          to={`/restaurant/${favID}`}
          className={styles.link}
          onClick={context.handleToggleSidebar}
        >
          <img src={img} alt="" className={styles.image} />
          <div className={styles.data}>
            <p className={styles.name}>{name}</p>
            <p className={styles.city}>{city}</p>
          </div>
        </Link>
      </li>
    )}
  </AppContext.Consumer>
);

export default Item;
