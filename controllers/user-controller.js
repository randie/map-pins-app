import User from '../models/user';
import { OAuth2Client } from 'google-auth-library';
import { graphQLResultHasError } from 'apollo-utilities';

const OAUTH_CLIENT_ID = '743566532889-sig9nstap9c5hil42h88cocv649i2ckt.apps.googleusercontent.com';

//const client = new OAuth2Client(process.env.OAUTH_CLIENT_ID);
const client = new OAuth2Client(OAUTH_CLIENT_ID);

export const findOrCreateUser = async authToken => {
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
