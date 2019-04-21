import React from 'react';
import Card from './Card';
import styles from './List.module.scss';

const List = ({ items }) => (
  <div className={styles.wrapper}>
    <ul className={styles.list}>
      {items.length > 0 &&
        items.map(item => (
          <li key={item.id}>
            <Card {...item} />
          </li>
        ))}
    </ul>
  </div>
);

export default List;
