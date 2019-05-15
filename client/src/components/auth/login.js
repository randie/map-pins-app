import React from 'react';
import { GoogleLogin } from 'react-google-login';
import { GraphQLClient } from 'graphql-request';
import { withStyles } from '@material-ui/core/styles';
// import Typography from "@material-ui/core/Typography";

const graphqlEndpoint = 'http://localhost:4000/graphql';
const graphqlQuery = `
{
  me {
    name
    email
    picture
  }
}
`;

const Login = ({ classes }) => {
  const handleSuccess = async googleUser => {
    debugger;
    const idToken = googleUser.getAuthResponse().id_token;
    const graphqlClient = new GraphQLClient(graphqlEndpoint, {
      headers: { authorization: idToken },
    });
    const data = await graphqlClient.request(graphqlQuery);
    console.log('SUCCESS! data from graphql request:', data);
  };

  return (
    <GoogleLogin
      clientId="743566532889-sig9nstap9c5hil42h88cocv649i2ckt.apps.googleusercontent.com"
      onSuccess={handleSuccess}
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
