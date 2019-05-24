import React, { useContext } from 'react';
import { GoogleLogin } from 'react-google-login';
import { GraphQLClient } from 'graphql-request';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { GRAPHQL_ENDPOINT } from '../../hooks/graphql-client';

import Context from '../../context';
import { meQuery } from '../../graphql/queries';

const Login = ({ classes }) => {
  const { dispatch } = useContext(Context);

  const handleSuccess = async googleUser => {
    try {
      const options = {
        headers: { authorization: googleUser.getAuthResponse().id_token },
      };
      const graphqlClient = new GraphQLClient(GRAPHQL_ENDPOINT, options);
      const { me } = await graphqlClient.request(meQuery);
      dispatch({ type: 'LOGIN', payload: me });
      dispatch({ type: 'SET_IS_LOGGED_IN', payload: googleUser.isSignedIn() });
    } catch (error) {
      handleFailure(error);
    }
  };

  const handleFailure = error => console.error('ERROR! Login failed', error);

  return (
    <div className={classes.root}>
      <Typography
        component="h1"
        variant="h3"
        gutterBottom
        noWrap
        style={{ color: 'rgb(66, 133, 244)' }}
      >
        Welcome
      </Typography>
      <GoogleLogin
        clientId="743566532889-sig9nstap9c5hil42h88cocv649i2ckt.apps.googleusercontent.com"
        onSuccess={handleSuccess}
        onFailure={handleFailure}
        isSignedIn={true}
        buttonText="Login with Google"
        theme="dark"
      />
    </div>
  );
};

const styles = {
  root: {
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
  },
};

export default withStyles(styles)(Login);
