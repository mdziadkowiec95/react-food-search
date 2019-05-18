import React from 'react';
import styles from './Autocomplete.module.scss';
import AppContext from '../../AppContext';

const Autocomplete = ({ items }) => (
  <AppContext.Consumer>
    {context => (
      <div className={styles.wrapper}>
        <ul className={styles.list}>
          {items.map(item => (
            <li
              key={item.id}
              className={styles.listItem}
              onClick={event => context.setCity(event, item.id, item.name)}
              data-id={item.id}
            >
              {item.name}
            </li>
          ))}
        </ul>
      </div>
    )}
  </AppContext.Consumer>
);

export default Autocomplete;
