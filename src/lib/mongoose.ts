import mongoose from 'mongoose';

const dbConnect = async () => {
  try {
    const MONGODB_URI = process.env.MONGODB_URI as string;
    if (!MONGODB_URI) {
      throw new Error('Please define the MONGODB_URI environment variable.');
    }

    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
};

export default dbConnect;
