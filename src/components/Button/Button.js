import React from 'react';
import styles from './Button.module.scss';
import cn from 'classnames';

const Button = ({
  secondary,
  primary,
  submit,
  isDisabled,
  href,
  blank,
  children
}) => {
  let btnClass;

  if (secondary) {
    btnClass = cn(styles.btn, styles.btnSecondary);
  } else if (primary) {
    btnClass = cn(styles.btn, styles.btnPrimary);
  } else if (submit) {
    btnClass = cn(styles.btn, styles.btnSubmit);
  }

  if (!href) {
    return (
      <button
        type={submit ? 'submit' : 'button'}
        disabled={isDisabled}
        className={btnClass}
      >
        {children}
      </button>
    );
  } else {
    return (
      <a href={href} target={blank ? blank : ''} className={btnClass}>
        {children}
      </a>
    );
  }
};

export default Button;
