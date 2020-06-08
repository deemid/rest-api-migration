import mongoose from 'mongoose';
import { config } from './config';

const mongooseOptions = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
  useMongoClient: true,
};

export default () => mongoose.connect(config.mongoUri, mongooseOptions);
