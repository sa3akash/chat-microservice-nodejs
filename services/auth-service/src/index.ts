import http from 'node:http';

import { env } from '@/config';
import { createApp } from '@/app';
import { logger } from '@/utils/Logger';

const main = async () => {
  try {
    const app = createApp();

    const server = http.createServer(app);
    const PORT = env.AUTH_SERVICE_PORT;

    server.listen(PORT, () => {
      logger.info({ PORT }, 'Auth service is running');
    });

    const shutdown = () => {
      logger.info('Shutting down auth service...');

      //   closeDatabase(), closePublisher()
      Promise.all([])
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
