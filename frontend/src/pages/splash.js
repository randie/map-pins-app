import React, { useContext } from 'react';
import { Redirect } from 'react-router-dom';
import Context from '../context';
import Login from '../components/auth/login';

const Splash = () => {
  const { isLoggedIn } = useContext(Context).state;
  return isLoggedIn ? <Redirect to="/" /> : <Login />;
};

export default Splash;
