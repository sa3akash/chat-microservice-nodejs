import info from './info.json';
import servers from './servers.json';
import components from './components.json';
import paths from './paths';
import type { Application } from 'express';
import { apiReference } from '@scalar/express-api-reference';

const swaggerDocument = {
  openapi: '3.0.0',
  info,
  servers,
  components,
  security: [
    {
      bearerAuth: [],
    },
  ],
  paths,
};

export const docsInit = (app: Application) => {
  app.use(
    '/docs',
    apiReference({
      theme: 'purple',
      spec: {
        content: swaggerDocument,
      },
    }),
  );

  app.get('/docs.json', (req, res) => {
    res.set('Content-Type', 'application/json');
    res.json(swaggerDocument);
  });

  app.get('/', (_req, res) => {
    res.redirect('/docs');
  });
};
