import http from 'node:http';

import { closeDatabase, initializeDatabase, env } from '@/config';
import { logger } from '@/utils/Logger';
import { createApp } from '@/app';
import { closeMessaging, initMessaging } from '@/queues/event-publisher';
import { startAuthEventConsumer, stopAuthEventConsume } from '@/queues/auth-consumer';

const main = async () => {
  try {
    await initializeDatabase();
    await initMessaging();
    await startAuthEventConsumer();

    const app = createApp();

    const server = http.createServer(app);
    const PORT = env.USER_SERVICE_PORT;

    server.listen(PORT, () => {
      logger.info({ PORT }, 'User service is running');
    });

    const shutdown = () => {
      logger.info('Shutting down user service...');
      Promise.all([closeDatabase(), closeMessaging(), stopAuthEventConsume()])
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
    logger.error({ error }, 'Failed to start user service');
    process.exit(1);
  }
};

main();
