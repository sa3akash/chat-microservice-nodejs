import http from 'node:http';

import { env, connectDb, disconnectDb, connectRedis, closeRedis } from '@/config';
import { createApp } from '@/app';
import { logger } from '@/utils/Logger';
import { startConsumers, stopConsumers } from '@/queues/rabbitmq.consume';

const main = async () => {
  try {
    await Promise.all([connectDb(), connectRedis(), startConsumers()]);
    const app = createApp();

    const server = http.createServer(app);
    const PORT = env.CHAT_SERVICE_PORT;

    server.listen(PORT, () => {
      logger.info({ PORT }, 'Chat service is running');
    });

    const shutdown = () => {
      logger.info('Shutting down chat service...');
      Promise.all([disconnectDb(), closeRedis(), stopConsumers()])
        .catch((error: unknown) => {
          logger.error({ error }, 'Error during shutdown tasks');
        })
        .finally(() => {
          server.close(() => process.exit(0));
        });
    };

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
  } catch (error) {
    logger.error({ error }, 'Failed to start chat service');
    process.exit(1);
  }
};

main();
