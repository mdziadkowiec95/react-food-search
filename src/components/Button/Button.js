import React from 'react';
import styles from './Button.module.scss';
import cn from 'classnames';

const Button = ({ secondary, submit, children }) => {
  const btnClass = secondary
    ? cn(styles.btn, styles.btnSecondary)
    : cn(styles.btn, styles.btnPrimary);
  return (
    <button type={submit ? 'submit' : 'button'} className={btnClass}>
      {children}
    </button>
  );
};

export default Button;
