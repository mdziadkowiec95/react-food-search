import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Navigation.module.scss';

const Navigation = props => (
  <nav>
    <ul>
      <li>
        <Link to="/" className={styles.navLink}>
          Home
        </Link>
      </li>
      <li>
        <Link to="/sign-up" className={styles.navLink}>
          Sign Up
        </Link>
      </li>
    </ul>
  </nav>
);

export default Navigation;
