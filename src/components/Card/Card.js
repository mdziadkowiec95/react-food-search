import React from 'react';
import styles from './Card.module.scss';
import { Link } from 'react-router-dom';

const Card = ({
  address,
  area,
  city,
  costForTwo,
  cuisines,
  currency,
  id,
  img,
  name,
  ratingColor,
  ratingNumber,
  ratingText,
  votes
}) => (
  <a href="#">
    <div>Card item</div>
  </a>
);

export default Card;
