import React from 'react';
import styles from './Details.module.scss';
import Button from '../Button/Button';
import thumbPlaceholder from '../../assets/images/thumb-placeholder.jpg';
import ImageFullyLoaded from '../ImageFullyLoaded/ImageFullyLoaded';
import Heading from '../Heading/Heading';

class Details extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      dataArrived: false
    };
  }

  static getDerivedStateFromProps(props, state) {
    if (props.id) {
      return {
        dataArrived: true
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

    if (this.state.dataArrived) {
      return (
        <div className={styles.wrapper}>
          <Heading background>{name}</Heading>
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
              <ImageFullyLoaded
                imageUrl={img.full ? img.full : thumbPlaceholder}
                alt=""
                imgClass={styles.thumbImg}
              />
            </div>
          </div>
          <Button secondary href={url} target="_blank">
            Visit website
          </Button>
        </div>
      );
    } else {
      return null;
    }
  }
}

export default Details;
