import React from 'react';
import styles from './Select.module.scss';

const Select = ({ dataType, onChangeFn, items }) => {
  const ID = dataType === 'cuisine' ? dataType + '_id' : 'id';
  const name = dataType === 'cuisine' ? dataType + '_name' : 'name';
  const optionAllText =
    dataType === 'cuisine' ? 'All cuisines' : 'All categories';

  return (
    <select onChange={e => onChangeFn(e)} className={styles.select}>
      <option value="">{optionAllText}</option>
      {items.map(item => (
        <option
          key={item[dataType][ID]}
          data-id={item[dataType][ID]}
          value={item[dataType][name]}
        >
          {item[dataType][name]}
        </option>
      ))}
    </select>
  );
};

export default Select;
