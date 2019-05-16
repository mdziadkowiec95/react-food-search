import React from 'react';
import styles from './LikeButton.module.scss';
import { MdFavorite, MdFavoriteBorder } from 'react-icons/md';

const LikeButton = ({ isFav, toggleIsFavFn }) => (
  <button onClick={event => toggleIsFavFn(event, isFav)}>
    {isFav ? (
      <MdFavorite size={25} color="#ff0000" />
    ) : (
      <MdFavoriteBorder size={25} color="#ff0000" />
    )}
  </button>
);

export default LikeButton;
