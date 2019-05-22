import React from 'react';
import { withFirebase } from '../Firebase';
import styles from './SignOutButton.module.scss';

const SignOutButton = ({ firebase }) => (
  <button type="button" onClick={firebase.doSignOut} className={styles.button}>
    Sign Out
  </button>
);

export default withFirebase(SignOutButton);
