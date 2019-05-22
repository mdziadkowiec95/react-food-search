import React from 'react';
import { withFirebase } from '../Firebase';
import Button from '../Button/Button';
import styles from './PasswordForgetForm.module.scss';

const initialState = {
  email: '',
  error: null
};

class PasswordForgetFormBase extends React.Component {
  constructor(props) {
    super(props);

    this.state = { ...initialState };
  }

  onSubmit = event => {
    const { email } = this.state;

    this.props.firebase
      .doPasswordReset(email)
      .then(() => {
        this.setState({ ...initialState });
      })
      .catch(error => {
        this.setState({ error });
      });

    event.preventDefault();
  };

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const { email, error } = this.state;

    const isInvalid = email === '';

    return (
      <>
        <h2>Reset your password</h2>
        <form onSubmit={this.onSubmit} className={styles.form}>
          <input
            name="email"
            value={this.state.email}
            onChange={this.onChange}
            type="text"
            placeholder="Email Address"
            className={styles.input}
          />
          <Button submit disabled={isInvalid}>
            Reset my password
          </Button>

          {error && <p>{error.message}</p>}
        </form>
      </>
    );
  }
}

const PasswordForgetForm = withFirebase(PasswordForgetFormBase);

export default PasswordForgetForm;
