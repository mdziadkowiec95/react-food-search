import React from 'react';
import styles from './Select.module.scss';

const Select = ({ dataType, items }) => (
  <select>
    <option value="">All cuisines</option>
    {console.log(items)}
    {console.log(dataType + '_id')}
    {items.map(item => (
      <option
        key={item[dataType][dataType + '_id']}
        value={item[dataType][dataType + '_name']}
      >
        {item[dataType][dataType + '_name']}
      </option>
    ))}
  </select>
);

export default Select;
