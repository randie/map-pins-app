import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import Context from '../../context';

const ProtectedRoute = ({ component: Component, ...attributes }) => {
  const { isLoggedIn } = useContext(Context).state;

  return (
    <Route
      {...attributes}
      render={props => (isLoggedIn ? <Component /> : <Redirect to="/login" />)}
    />
  );
};

export default ProtectedRoute;
