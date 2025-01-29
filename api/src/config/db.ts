import mongoose from 'mongoose';
import { MONGO_URI } from '../constants/env';

export async function connectToDatabase() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to database successfully');
  } catch (error) {
    console.log('Error connecting to database', error);
    process.exit(1);
  }
}
