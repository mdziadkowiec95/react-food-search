import React from 'react';
import { Link } from 'react-router-dom';
import SignInForm from '../../components/SignInForm/SignInForm';
import Container from '../../components/Base/Container';
import Heading from '../../components/Heading/Heading';

const SignInView = () => (
  <Container>
    <Heading background>SignIn</Heading>
    <SignInForm />
    <p>
      Forgot password? Click <Link to="/password-forget">HERE</Link>
    </p>
  </Container>
);

export default SignInView;
