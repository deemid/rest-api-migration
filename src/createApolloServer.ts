import { ApolloServer, gql } from 'apollo-server-koa';
import fs from 'fs';
import path from 'path';
import jwt from 'jsonwebtoken';
import resolvers from './resolvers';
import { config } from './config';
import User from './models/user';

const createApolloServer = (app: any) => {
  const typeDefs = gql`${fs.readFileSync(path.resolve(__dirname, '../', 'schema.gql'), {
    encoding: 'utf8',
  })}`;

  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    context: async (ctx) => {
      let currentUser = null;
      const auth = ctx.ctx.request.header.authorization;
      if (auth) {
        const token = auth.split('Bearer ')[1];
        // parse token
        if (token) {
          const decoded = jwt.verify(token, config.jwtSecret);

          if (decoded) {
          // ***** TODO: remove 'as any' *****
            const user = await User.findById((decoded as any).id);
            currentUser = user;
          }
        }
      }

      return { currentUser };
    },
  });
  apolloServer.applyMiddleware({ app });

  return apolloServer;
};

export default createApolloServer;
