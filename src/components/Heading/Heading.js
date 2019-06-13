import React from 'react';
import styles from './Heading.module.scss';
import cx from 'classnames';

const Heading = ({ background, children }) => {
  const headingStyles = background
    ? cx(styles.heading, styles.headingBackground)
    : styles.heading;
  return <h2 className={headingStyles}>{children}</h2>;
};

export default Heading;
