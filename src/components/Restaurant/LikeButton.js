import React from 'react';
import styles from './LikeButton.module.scss';
import { MdThumbUp, MdThumbDown } from 'react-icons/md';

const LikeButtonAuth = ({ isFav, toggleIsFavFn }) => (
  <button
    onClick={event => toggleIsFavFn(event, isFav)}
    className={styles.button}
  >
    {isFav ? (
      <span className={styles.inner}>
        <MdThumbDown size={25} color="#fff" />
        <span className={styles.label}>Unlike</span>
      </span>
    ) : (
      <span className={styles.inner}>
        <MdThumbUp size={25} color="#fff" />
        <span className={styles.label}>Like!</span>
      </span>
    )}
  </button>
);

class LikeButtonNonAuth extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showAlert: false
    };
  }

  showAlert = () => {
    this.setState({
      showAlert: true
    });

    setTimeout(() => {
      this.setState({
        showAlert: false
      });
    }, 3000);
  };

  render() {
    return (
      <div className={styles.wrapper}>
        <button onClick={this.showAlert} className={styles.button}>
          <span className={styles.inner}>
            <MdThumbUp size={25} color="#fff" />
            <span className={styles.label}>Like!</span>
          </span>
        </button>
        {this.state.showAlert && (
          <div className={styles.alert}>
            <p className={styles.alertText}>
              This feature is only for authenticated users!
            </p>
          </div>
        )}
      </div>
    );
  }
}

export { LikeButtonAuth, LikeButtonNonAuth };
