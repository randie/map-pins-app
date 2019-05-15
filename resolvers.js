import { AuthenticationError } from 'apollo-server';

const randie = {
  _id: '1',
  name: 'Randie',
  email: 'randie@zombo.com',
  picture: 'https//cloudinary.com/randie.jpg',
};

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
    //me: authenticated((root, args, context, info) => context.currentUser), // authenticated user
    me: authenticated(user), // authenticated user
  },
};

export default resolvers;
