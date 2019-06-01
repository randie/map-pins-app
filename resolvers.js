import { AuthenticationError, PubSub } from 'apollo-server';
import Pin from './models/pin';

const pubsub = new PubSub();

// subscription channels
const PIN_CREATED_CHANNEL = 'PIN_CREATED';
const PIN_DELETED_CHANNEL = 'PIN_DELETED';
const COMMENT_CREATED_CHANNEL = 'COMMENT_CREATED';

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
      const pinDeleted = await Pin.findOneAndDelete({ _id: args.pinId }).exec();
      pubsub.publish(PIN_DELETED_CHANNEL, { pinDeleted });

      return pinDeleted;
    }),
    createComment: authenticated(async (root, args, context, info) => {
      const newComment = { text: args.text, author: context.currentUser._id };
      const pinWithNewComment = await Pin.findOneAndUpdate(
        { _id: args.pinId },
        { $push: { comments: newComment } },
        { new: true },
      )
        .populate('author')
        .populate('comments.author');
      pubsub.publish(COMMENT_CREATED_CHANNEL, { commentCreated: pinWithNewComment });

      return pinWithNewComment;
    }),
  },

  Subscription: {
    pinCreated: {
      subscribe: () => pubsub.asyncIterator(PIN_CREATED_CHANNEL),
    },
    pinDeleted: {
      subscribe: () => pubsub.asyncIterator(PIN_DELETED_CHANNEL),
    },
    commentCreated: {
      subscribe: () => pubsub.asyncIterator(COMMENT_CREATED_CHANNEL),
    },
  },
};

export default resolvers;
