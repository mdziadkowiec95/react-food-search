import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './Navigation.module.scss';
import SignOutButton from '../SignOutButton/SignOutButton';
import { AuthUserContext } from '../Session';
import AppContext from '../../AppContext';
import { MdMenu, MdChevronLeft } from 'react-icons/md';

const sidebarIconSize = 35;

const Navigation = ({ authUser }) => (
  <>
    <AuthUserContext.Consumer>
      {authUser => (
        <AppContext.Consumer>
          {context =>
            authUser ? (
              <NavigationAuth
                toggleSidebarFn={context.handleToggleSidebar}
                isSidebarOpen={context.isSidebarOpen}
              />
            ) : (
              <NavigationNonAuth
                toggleSidebarFn={context.handleToggleSidebar}
                isSidebarOpen={context.isSidebarOpen}
              />
            )
          }
        </AppContext.Consumer>
      )}
    </AuthUserContext.Consumer>
  </>
);

const NavigationAuth = props => (
  <nav className={styles.nav}>
    <button onClick={props.toggleSidebarFn} className={styles.sidebarToggle}>
      {props.isSidebarOpen ? (
        <MdChevronLeft size={sidebarIconSize} />
      ) : (
        <MdMenu size={sidebarIconSize} />
      )}
    </button>
    <ul className={styles.navList}>
      <li className={styles.navItem}>
        <NavLink
          exact
          to="/"
          activeClassName={styles.navItemLinkActive}
          className={styles.navItemLink}
        >
          Home
        </NavLink>
      </li>
      <li className={styles.navItem}>
        <NavLink
          to="/sign-up"
          activeClassName={styles.navItemLinkActive}
          className={styles.navItemLink}
        >
          Sign Up
        </NavLink>
      </li>
      <li className={styles.navItem}>
        <NavLink
          to="/account"
          activeClassName={styles.navItemLinkActive}
          className={styles.navItemLink}
        >
          Account
        </NavLink>
      </li>
      <li className={styles.navItem}>
        <SignOutButton />
      </li>
    </ul>
  </nav>
);

const NavigationNonAuth = props => (
  <nav className={styles.nav}>
    <button onClick={props.toggleSidebarFn} className={styles.sidebarToggle}>
      {props.isSidebarOpen ? (
        <MdChevronLeft size={sidebarIconSize} />
      ) : (
        <MdMenu size={sidebarIconSize} />
      )}
    </button>
    <ul className={styles.navList}>
      <li className={styles.navItem}>
        <NavLink
          exact
          to="/"
          activeClassName={styles.navItemLinkActive}
          className={styles.navItemLink}
        >
          Home
        </NavLink>
      </li>
      <li className={styles.navItem}>
        <NavLink
          to="/sign-up"
          activeClassName={styles.navItemLinkActive}
          className={styles.navItemLink}
        >
          Sign Up
        </NavLink>
      </li>
      <li className={styles.navItem}>
        <NavLink
          to="/account"
          activeClassName={styles.navItemLinkActive}
          className={styles.navItemLink}
        >
          Account
        </NavLink>
      </li>
      <li className={styles.navItem}>
        <NavLink
          to="/sign-in"
          activeClassName={styles.navItemLinkActive}
          className={styles.navItemLink}
        >
          Sign In
        </NavLink>
      </li>
    </ul>
  </nav>
);

export default Navigation;
