import User from '../models/user';
import { OAuth2Client } from 'google-auth-library';
import { graphQLResultHasError } from 'apollo-utilities';

const client = new OAuth2Client(process.env.OAUTH_CLIENT_ID);

export const findOrCreateUser = async authToken => {
  window.alert('findOrCreateUser');
  const googleUser = await verifyAuthToken(authToken);
  const user = await User.findOne({ email: googleUser.email }).exec();
  return user || newUser(googleUser);
};

const verifyAuthToken = async authToken => {
  try {
    const ticket = await client.verifyIdToken({
      idToken: authToken,
      audience: process.env.OAUTH_CLIENT_ID,
    });
    return ticket.getPayload();
  } catch (error) {
    console.error(`ERROR! Unable to verify token ${authToken}`);
  }
};

const newUser = ({ name, email, picture }) => {
  return new User({ name, email, picture }).save();
};
