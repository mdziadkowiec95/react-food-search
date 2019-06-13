import React from 'react';
import { PushSpinner } from 'react-spinners-kit';
import styles from './ImageFullyLoaded.module.scss';
import cx from 'classnames';

class ImageFullyLoaded extends React.Component {
  constructor(props) {
    super(props);
    this.state = { imageStatus: 'loading' };
  }

  handleImageLoaded() {
    this.setState({ imageStatus: 'loaded' });
  }

  handleImageErrored() {
    this.setState({ imageStatus: 'failed to load' });
  }

  render() {
    const { imageUrl, alt, imgClass } = this.props;

    const css =
      this.state.imageStatus === 'loaded'
        ? cx(imgClass, styles.img, styles.imgLoaded)
        : cx(imgClass, styles.img, styles.imgHidden);

    return (
      <div className={styles.wrapper}>
        <img
          src={imageUrl}
          alt={alt}
          className={css}
          onLoad={this.handleImageLoaded.bind(this)}
          onError={this.handleImageErrored.bind(this)}
        />
      </div>
    );
  }
}
export default ImageFullyLoaded;
