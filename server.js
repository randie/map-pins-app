import { ApolloServer } from 'apollo-server';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import typeDefs from './typedefs';
import resolvers from './resolvers';
import { findOrCreateUser } from './controllers/user-controller';

dotenv.config();

mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(error => console.error(error));

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req, connection }) => {
    if (Boolean(connection)) {
      return connection.context;
    }
    try {
      if (Boolean(req)) {
        const authToken = req.headers.authorization || '';
        if (!authToken) return {};
        const currentUser = await findOrCreateUser(authToken);
        return { currentUser };
      }
    } catch (error) {
      console.error('ERROR! Unable to authenticate user:', error.message);
    }
  },
});

server.listen().then(({ url }) => console.log(`Server is listening on ${url}`));
