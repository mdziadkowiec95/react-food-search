import React from 'react';
import { CircleSpinner } from 'react-spinners-kit';

const Spinner = ({ className, size, color, loadingCondition }) => (
  <div className={className}>
    <CircleSpinner
      size={size ? size : 25}
      color={color ? color : '#e67e22'}
      loading={loadingCondition}
    />
  </div>
);

export default Spinner;
