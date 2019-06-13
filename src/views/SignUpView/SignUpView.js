import React from 'react';
import SignUpForm from '../../components/SignUpForm/SignUpForm';
import Container from '../../components/Base/Container';
import Heading from '../../components/Heading/Heading';

const SignUpView = props => (
  <Container>
    <Heading background>Sign Up view</Heading>
    <SignUpForm />
  </Container>
);

export default SignUpView;
