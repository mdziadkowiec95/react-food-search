import React from 'react';
import styles from './GlobalLoader.module.scss';
import { CircleSpinner } from 'react-spinners-kit';

const GlobalLoader = ({ size, color }) => (
  <div className={styles.loader}>
    <div className={styles.loaderCircle}>
      <CircleSpinner size={60} color="#e67e22" />
    </div>
  </div>
);

export default GlobalLoader;
