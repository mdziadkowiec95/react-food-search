import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Navigation.module.scss';
import SignOutButton from '../SignOutButton/SignOutButton';

import { AuthUserContext } from '../Session';

const Navigation = ({ authUser }) => (
  <>
    <AuthUserContext.Consumer>
      {authUser => (authUser ? <NavigationAuth /> : <NavigationNonAuth />)}
    </AuthUserContext.Consumer>
  </>
);

const NavigationAuth = props => (
  <nav className={styles.nav}>
    <ul className={styles.navList}>
      <li className={styles.navItem}>
        <Link to="/" className={styles.navLink}>
          Home
        </Link>
      </li>
      <li className={styles.navItem}>
        <Link to="/sign-up" className={styles.navLink}>
          Sign Up
        </Link>
      </li>
      <li className={styles.navItem}>
        <Link to="/account" className={styles.navLink}>
          Account
        </Link>
      </li>
      {/* <li className={styles.navItem}>
        <Link to="/sign-in" className={styles.navLink}>
          Sign In
        </Link>
      </li> */}
      <li className={styles.navItem}>
        <SignOutButton />
      </li>
    </ul>
  </nav>
);

const NavigationNonAuth = props => (
  <nav className={styles.nav}>
    <ul className={styles.navList}>
      <li className={styles.navItem}>
        <Link to="/" className={styles.navLink}>
          Home
        </Link>
      </li>
      <li className={styles.navItem}>
        <Link to="/sign-up" className={styles.navLink}>
          Sign Up
        </Link>
      </li>
      <li className={styles.navItem}>
        <Link to="/account" className={styles.navLink}>
          Account
        </Link>
      </li>
      <li className={styles.navItem}>
        <Link to="/sign-in" className={styles.navLink}>
          Sign In
        </Link>
      </li>
    </ul>
  </nav>
);

export default Navigation;
