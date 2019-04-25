import React from 'react';
import { Link } from 'react-router-dom';
import SignInForm from '../../components/SignInForm/SignInForm';

const SignInView = () => (
  <div>
    <h1>SignIn</h1>
    <SignInForm />
    <p>
      Forgot password? Click <Link to="/password-forget">HERE</Link>
    </p>
  </div>
);

export default SignInView;
