import mongoose from 'mongoose';
import { env } from './env';
import { logger } from '@/utils/Logger';

const connectOnce = async () => {
  try {
    logger.info(
      `Connecting to MongoDB at ${env.MONGO_DB_URL ? '(URL provided)' : '(URL missing)'}`,
    );
    return await mongoose.connect(env.MONGO_DB_URL);
  } catch (error) {
    logger.error({ error }, 'MongoDB initial connection failed');
    throw error;
  }
};

export const connectDb = async () => {
  try {
    const connection = await connectOnce();
    logger.info('MongoDB connected');

    connection.connection.on('error', (error) => {
      logger.error({ error }, 'MongoDB connection error');
      // Decide if you want to exit or attempt reconnect
      process.exit(1);
    });

    connection.connection.on('disconnected', async () => {
      logger.info('MongoDB disconnected');
      // Optional automatic reconnect
      try {
        await connectOnce();
      } catch (err) {
        logger.error({ error: err }, 'MongoDB reconnection failed');
      }
    });

    connection.connection.on('reconnected', () => {
      logger.info('MongoDB reconnected');
    });
  } catch (err) {
    // If initial connect fails, decide how to proceed (exit or retry)
    logger.error({ error: err }, 'Could not connect to MongoDB');
    throw err;
  }
};

export const disconnectDb = async () => {
  await mongoose.disconnect();
};
