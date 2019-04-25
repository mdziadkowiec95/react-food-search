import React from 'react';
import PasswordForgetForm from '../../components/PasswordForgetForm/PasswordForgetForm';
import { AuthUserContext, withAuthorization } from '../../components/Session';

const AccountView = props => (
  <AuthUserContext.Consumer>
    {authUser => (
      <>
        <h3>Active account: {authUser.email}</h3>
        <PasswordForgetForm />
      </>
    )}
  </AuthUserContext.Consumer>
);

const condition = authUser => !!authUser;

export default withAuthorization(condition)(AccountView);
