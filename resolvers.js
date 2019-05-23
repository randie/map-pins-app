import { AuthenticationError } from 'apollo-server';
import Pin from './models/pin';

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
  Mutation: {
    createPin: authenticated(async (root, args, context, info) => {
      console.log('>> createPin args:', args);
      return {
        title: 'Grant Park',
        image: 'http://res.cloudinary.com/randie/image/upload/v1558571889/gjqkfd0idlpbkj8gqtu6.jpg',
        content: 'Meow',
        latitude: 45.539,
        longitude: -122.629,
      };
    }),
  },
};

export default resolvers;
