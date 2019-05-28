import React from 'react';
import styles from './Details.module.scss';
import Button from '../Button/Button';
import thumbPlaceholder from '../../assets/images/thumb-placeholder.jpg';
import GlobalLoader from '../Base/GlobalLoader';

class Details extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true
    };
  }

  static getDerivedStateFromProps(props, state) {
    if (props.id) {
      return {
        isLoading: false
      };
    } else {
      return null;
    }
  }

  render() {
    const {
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
    } = this.props;

    const ratingStyleColor = {
      color: `#${ratingColor}`
    };

    if (this.state.isLoading) {
      return <GlobalLoader />;
    } else {
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
                <span className={styles.ratingNumber}>{ratingNumber}</span>
                <span className={styles.ratingText} style={ratingStyleColor}>
                  {ratingText}
                </span>
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
          <Button secondary href={url} target="_blank">
            Visit website
          </Button>
        </div>
      );
    }
  }
}

export default Details;
