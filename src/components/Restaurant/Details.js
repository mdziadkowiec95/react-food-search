import React from 'react';
import styles from './Details.module.scss';
import thumbPlaceholder from '../../assets/images/thumb-placeholder.jpg';

const Details = ({
  id,
  url,
  name,
  area,
  address,
  city,
  img,
  cuisines,
  currency,
  costForTwo,
  ratingColor,
  ratingNumber,
  ratingText,
  votes
}) => {
  const ratingBackground = {
    backgroundColor: `#${ratingColor}`
  };

  if (id) {
    return (
      <div className={styles.wrapper}>
        <h2 className={styles.name}>{name}</h2>
        <div className={styles.inner}>
          <div className={styles.details}>
            <p>{cuisines}</p>
            <p>{area}</p>
            <p>{address}</p>
            <p>{city}</p>
            <p>
              {costForTwo} {currency}
            </p>
            <p className={styles.rating}>
              <span>Rating: </span>
              <span className={styles.ratingNumber} style={ratingBackground}>
                {ratingNumber}
              </span>
              {/* <span className={styles.ratingText}> ({ratingText})</span> */}
            </p>
            <p>Votes: {votes}</p>
            <p>{cuisines}</p>
          </div>
          <div className={styles.thumb}>
            <img
              src={img.full ? img.full : thumbPlaceholder}
              alt=""
              className={styles.thumbImg}
            />
          </div>
        </div>
        <a href={url} className={styles.link} target="_blank">
          Visit website
        </a>
      </div>
    );
  } else {
    return null;
  }
};

export default Details;
