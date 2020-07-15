import mongoose from 'mongoose';
import Product from './product';

const connectDb = (databaseUrl) => {
  return mongoose.connect(databaseUrl, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true});
};

const models = {Product};

export {connectDb}
export default models;
