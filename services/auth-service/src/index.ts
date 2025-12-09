import http from 'node:http';

import { closeDatabase, connectToDatabase, env } from '@/config';
import { createApp } from '@/app';
import { logger } from '@/utils/Logger';
import { initModels } from '@/models';
import { closePublisher, initPublisher } from '@/queues/event-publishing';

const main = async () => {
  try {
    await connectToDatabase();
    await initModels();
    await initPublisher();

    const app = createApp();

    const server = http.createServer(app);
    const PORT = env.AUTH_SERVICE_PORT;

    server.listen(PORT, () => {
      logger.info({ PORT }, 'Auth service is running');
    });

    const shutdown = () => {
      logger.info('Shutting down auth service...');
      // closePublisher()
      Promise.all([closeDatabase(), closePublisher()])
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
    logger.error({ error }, 'Failed to start auth service');
    process.exit(1);
  }
};

main();
