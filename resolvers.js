import { AuthenticationError } from 'apollo-server';

const authenticated = next => (root, args, context, info) => {
  if (!context.currentUser) {
    throw new AuthenticationError('ERROR! You must be logged in.');
  }
  return next(root, args, context, info);
};

const user = (root, args, context, info) => {
  return context.currentUser;
};

const resolvers = {
  Query: {
    me: authenticated(user),
  },
};

export default resolvers;
