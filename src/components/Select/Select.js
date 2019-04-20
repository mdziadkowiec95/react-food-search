import React from 'react';
import styles from './Select.module.scss';

const Select = ({ dataType, items }) => {
  const ID = dataType === 'cuisine' ? dataType + '_id' : 'id';
  const name = dataType === 'cuisine' ? dataType + '_name' : 'name';
  const optionAllText =
    dataType === 'cuisine' ? 'All cuisines' : 'All categories';

  return (
    <select>
      <option value="">{optionAllText}</option>
      {console.log(items)}
      {console.log(ID)}
      {items.map(item => (
        <option key={item[dataType][ID]} value={item[dataType][name]}>
          {item[dataType][name]}
        </option>
      ))}
    </select>
  );
};

export default Select;
