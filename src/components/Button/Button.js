import React from 'react';
import styles from './Button.module.scss';
import cn from 'classnames';

const Button = ({ secondary, primary, submit, children }) => {
  let btnClass;

  if (secondary) {
    btnClass = cn(styles.btn, styles.btnSecondary);
  } else if (primary) {
    btnClass = cn(styles.btn, styles.btnPrimary);
  } else if (submit) {
    btnClass = cn(styles.btn, styles.btnSubmit);
  }

  return (
    <button type={submit ? 'submit' : 'button'} className={btnClass}>
      {children}
    </button>
  );
};

export default Button;
