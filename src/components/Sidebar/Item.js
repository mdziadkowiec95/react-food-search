import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Item.module.scss';
import styled from 'styled-components';

const Item = ({ name, favID, city, img }) => (
  <li key={favID} className={styles.item}>
    <Link to={`/restaurant/${favID}`} className={styles.link}>
      <img src={img} alt="" className={styles.image} />
      <div className={styles.data}>
        <p className={styles.name}>{name}</p>
        <p className={styles.city}>{city}</p>
      </div>
    </Link>
  </li>
);

export default Item;
