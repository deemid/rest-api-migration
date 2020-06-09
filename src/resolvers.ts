import { AuthenticationError } from 'apollo-server-koa';
import { Document } from 'mongoose';
import crypto from 'crypto';
import User, { IUser } from './models/user';
import { config } from './config';

const generateHash = (password: string): string => crypto.createHmac('sha1', config.salt).update(password).digest('hex');

type UpdateProfileInput = {
  password?: string;
  name?: string;
}

const resolvers = {
  Query: {
    async users(_parent: {}, _args: {}, _context: { currentUser: IUser }) {
      if (!_context.currentUser) {
        throw new AuthenticationError('you must be logged in to query this schema');
      }

      const users = await User.find();
      return users;
    },
    async user(_parent: {}, args: { id: string }, _context: { currentUser: IUser }) {
      if (!_context.currentUser) {
        throw new AuthenticationError('you must be logged in to query this schema');
      }
      const user = await User.findById(args.id);
      return user;
    },
  },
  Mutation: {
    async createUser(_parent: {}, args: { input: IUser }) {
      const newUser = await User.create(args.input);
      return newUser;
    },
    async updateProfile(_: {},
      args: { input: UpdateProfileInput },
      _context: { currentUser: IUser & Document }) {
      if (!_context.currentUser) {
        throw new AuthenticationError('you must be logged in to query this schema');
      }

      const { input } = args;
      const user: IUser & Document = _context.currentUser;

      if (input.name) {
        user.name = input.name;
      }

      if (input.password) {
        const hashedPassword = generateHash(input.password);
        input.password = hashedPassword;
      }

      await user.save();
      return user;
    },
  },
};

export default resolvers;
