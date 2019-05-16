import React, { useContext } from 'react';
import { GoogleLogin } from 'react-google-login';
import { GraphQLClient } from 'graphql-request';
import { withStyles } from '@material-ui/core/styles';
// import Typography from "@material-ui/core/Typography";

import Context from '../../context';

const graphqlEndpoint = 'http://localhost:4000/graphql';
const graphqlQuery = `
{
  me {
    _id
    name
    email
    picture
  }
}
`;

const Login = ({ classes }) => {
  const { dispatch } = useContext(Context);

  const handleSuccess = async googleUser => {
    try {
      const options = {
        headers: { authorization: googleUser.getAuthResponse().id_token },
      };
      const graphqlClient = new GraphQLClient(graphqlEndpoint, options);
      const { me } = await graphqlClient.request(graphqlQuery);
      dispatch({ type: 'LOGIN_USER', payload: me });
    } catch (error) {
      handleFailure(error);
    }
  };

  const handleFailure = error => console.error('ERROR! Login failed', error);

  return (
    <GoogleLogin
      clientId="743566532889-sig9nstap9c5hil42h88cocv649i2ckt.apps.googleusercontent.com"
      onSuccess={handleSuccess}
      onFailure={handleFailure}
      isSignedIn={true}
    />
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
