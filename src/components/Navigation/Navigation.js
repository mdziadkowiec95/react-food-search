import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './Navigation.module.scss';
import SignOutButton from '../SignOutButton/SignOutButton';
import { AuthUserContext } from '../Session';
import AppContext from '../../AppContext';
import { MdMenu, MdClose, MdFirstPage, MdLastPage } from 'react-icons/md';
import cn from 'classnames';

const navIconSize = 35;

const Navigation = ({ authUser }) => (
  <>
    <AuthUserContext.Consumer>
      {authUser => (
        <AppContext.Consumer>
          {context =>
            authUser ? (
              <NavigationAuth
                toggleSidebarFn={context.handleToggleSidebar}
                toggleNavFn={context.handleToggleNav}
                isSidebarOpen={context.isSidebarOpen}
                isNavOpen={context.isNavOpen}
              />
            ) : (
              <NavigationNonAuth
                toggleSidebarFn={context.handleToggleSidebar}
                toggleNavFn={context.handleToggleNav}
                isSidebarOpen={context.isSidebarOpen}
                isNavOpen={context.isNavOpen}
              />
            )
          }
        </AppContext.Consumer>
      )}
    </AuthUserContext.Consumer>
  </>
);

const NavigationAuth = ({
  isNavOpen,
  isSidebarOpen,
  toggleNavFn,
  toggleSidebarFn
}) => {
  const navStyle = isNavOpen ? cn(styles.nav, styles.navOpen) : styles.nav;

  return (
    <nav className={navStyle}>
      <button onClick={toggleSidebarFn} className={styles.sidebarToggler}>
        {isSidebarOpen ? (
          <MdFirstPage size={navIconSize} />
        ) : (
          <MdLastPage size={navIconSize} />
        )}
      </button>
      <button onClick={toggleNavFn} className={styles.navToggler}>
        {isNavOpen ? (
          <MdClose size={navIconSize} />
        ) : (
          <MdMenu size={navIconSize} />
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
};

const NavigationNonAuth = ({
  isNavOpen,
  isSidebarOpen,
  toggleNavFn,
  toggleSidebarFn
}) => {
  const navStyle = isNavOpen ? cn(styles.nav, styles.navOpen) : styles.nav;

  return (
    <nav className={navStyle}>
      <button onClick={toggleSidebarFn} className={styles.sidebarToggler}>
        {isSidebarOpen ? (
          <MdFirstPage size={navIconSize} />
        ) : (
          <MdLastPage size={navIconSize} />
        )}
      </button>
      <button onClick={toggleNavFn} className={styles.navToggler}>
        {isNavOpen ? (
          <MdClose size={navIconSize} />
        ) : (
          <MdMenu size={navIconSize} />
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
};

export default Navigation;
