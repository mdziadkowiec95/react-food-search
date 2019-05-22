import React from 'react';
import styles from './Button.module.scss';
import cn from 'classnames';

const Button = ({ secondary, primary, submit, isDisabled, children }) => {
  let btnClass;

  if (secondary) {
    btnClass = cn(styles.btn, styles.btnSecondary);
  } else if (primary) {
    btnClass = cn(styles.btn, styles.btnPrimary);
  } else if (submit) {
    btnClass = cn(styles.btn, styles.btnSubmit);
  }
  console.log(`disabled: ${isDisabled}`);
  return (
    <button
      type={submit ? 'submit' : 'button'}
      disabled={isDisabled}
      className={btnClass}
    >
      {children}
    </button>
  );
};

export default Button;
