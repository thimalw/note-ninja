import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { AuthConsumer } from './contexts/AuthContext';

const ProtectedRoute = ({ component: Component, ...rest }) => (
  <AuthConsumer>
    {({ isLoggedIn }) => (
      <Route
        render={
          props =>
            isLoggedIn
            ? <Component {...props} />
            : <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
        }
        {...rest}
      />
    )}
  </AuthConsumer>
);

export default ProtectedRoute;