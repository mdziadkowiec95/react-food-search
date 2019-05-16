import React from 'react';
import Item from './Item';

const List = ({ items }) => (
  <ul>
    {items.map(item => (
      <Item key={item.favID} {...item} />
    ))}
  </ul>
);

export default List;
