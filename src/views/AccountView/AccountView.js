import React from 'react';
import PasswordForgetForm from '../../components/PasswordForgetForm/PasswordForgetForm';
import { AuthUserContext, withAuthorization } from '../../components/Session';
import Container from '../../components/Base/Container';
import Heading from '../../components/Heading/Heading';

const AccountView = props => (
  <AuthUserContext.Consumer>
    {authUser => (
      <>
        <Container>
          <Heading background>Profile</Heading>
          <h3>Active account: {authUser.email}</h3>
          <PasswordForgetForm />
        </Container>
      </>
    )}
  </AuthUserContext.Consumer>
);

const condition = authUser => !!authUser;

export default withAuthorization(condition)(AccountView);
