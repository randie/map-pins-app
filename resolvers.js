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
    pins: async (root, args, context, info) => {
      return await Pin.find({})
        .populate('author')
        .populate('comments.author');
    },
  },

  Mutation: {
    createPin: authenticated(async (root, args, context, info) => {
      const newPin = await new Pin({
        ...args.input,
        author: context.currentUser._id,
      }).save();

      const createdPin = await Pin.populate(newPin, 'author');
      return createdPin;
    }),
    deletePin: authenticated(async (root, args, context, info) => {
      const deletedPin = await Pin.findOneAndDelete({ _id: args.pinId }).exec();
      return deletedPin;
    }),
    createComment: authenticated(async (root, args, context, info) => {
      const newComment = { text: args.text, author: context.currentUser._id };
      const updatedPin = await Pin.findOneAndUpdate(
        { _id: args.pinId },
        { $push: { comments: newComment } },
        { new: true },
      )
        .populate('author')
        .populate('comments.author');
      return updatedPin;
    }),
  },
};

export default resolvers;
