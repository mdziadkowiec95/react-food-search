import React from 'react';
import styles from './Autocomplete.module.scss';
import AppContext from '../../AppContext';

class Autocomplete extends React.Component {
  constructor(props) {
    super(props);

    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  componentDidMount() {
    this.calculateHeight();

    document.addEventListener('mousedown', this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.items !== prevProps.items) {
      this.calculateHeight();
    }
  }

  calculateHeight() {
    const height = this.wrapEl.clientHeight;

    this.wrapEl.style.bottom = `-${height + 3}px`;
  }

  handleClickOutside(e) {
    if (this.wrapEl && !this.wrapEl.contains(e.target)) {
      this.props.setCityFn(e, true);
    }
  }

  render() {
    const { items, setCityFn } = this.props;

    return (
      <div className={styles.wrapper} ref={wrapEl => (this.wrapEl = wrapEl)}>
        <ul className={styles.list}>
          {items.map(item => (
            <li
              key={item.id}
              className={styles.listItem}
              onClick={e => setCityFn(e)}
              data-name={item.name}
            >
              {item.name}
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

export default Autocomplete;

// const Autocomplete = ({ items }) => (
//   <AppContext.Consumer>
//     {context => (
//       <div className={styles.wrapper}>
//         <ul className={styles.list}>
//           {items.map(item => (
//             <li
//               key={item.id}
//               className={styles.listItem}
//               onClick={event => context.setCity(event, item.id, item.name)}
//               data-id={item.id}
//             >
//               {item.name}
//             </li>
//           ))}
//         </ul>
//       </div>
//     )}
//   </AppContext.Consumer>
// );

// export default Autocomplete;
