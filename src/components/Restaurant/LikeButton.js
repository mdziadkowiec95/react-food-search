import React from 'react';
import styles from './LikeButton.module.scss';
import { MdThumbUp, MdThumbDown } from 'react-icons/md';

const LikeButton = ({ isFav, toggleIsFavFn }) => (
  <button
    onClick={event => toggleIsFavFn(event, isFav)}
    className={styles.button}
  >
    {isFav ? (
      <span className={styles.inner}>
        <MdThumbDown size={25} color="#3b5998" />
        <span className={styles.label}>Unlike</span>
      </span>
    ) : (
      <span className={styles.inner}>
        <MdThumbUp size={25} color="#8b9dc3" />
        <span className={styles.label}>Like!</span>
      </span>
    )}
  </button>
);

export default LikeButton;
