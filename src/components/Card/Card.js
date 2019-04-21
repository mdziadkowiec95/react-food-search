import React from 'react';
import styles from './Card.module.scss';
import { Link } from 'react-router-dom';
import thumbPlaceholder from '../../assets/images/thumb-placeholder.jpg';

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
}) => {
  console.log(img);
  console.log(thumbPlaceholder);
  const thumbImg = img ? img : thumbPlaceholder;

  return (
    <Link to={`/restaurant/${id}`} className={styles.link}>
      <div className={styles.top}>
        <div className={styles.topThumb}>
          <img src={thumbImg} alt="image" className={styles.topImg} />
        </div>
        <div className={styles.topTexts}>
          <h3 className={styles.name}>{name}</h3>
          <p className={styles.area}>{area}</p>
          <p>
            Cost for two: {costForTwo} {currency}
          </p>
          <p>Cuisines: {cuisines}</p>
        </div>
      </div>
      <div className={styles.bottom} />
    </Link>
  );
};

export default Card;
