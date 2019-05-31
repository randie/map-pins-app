import { AuthenticationError, PubSub } from 'apollo-server';
import Pin from './models/pin';

const pubsub = new PubSub();

// subscription channels
const PIN_CREATED_CHANNEL = 'PIN_CREATED';

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

      const pinCreated = await Pin.populate(newPin, 'author');
      pubsub.publish(PIN_CREATED_CHANNEL, { pinCreated });

      return pinCreated;
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

  Subscription: {
    pinCreated: {
      subscribe: () => pubsub.asyncIterator(PIN_CREATED_CHANNEL),
    },
  },
};

export default resolvers;
