import 'reflect-metadata';
import fastify from 'fastify';

import { env } from '../../config';

import { FilesRoutes } from './routes/files-routes';
import { FilesController } from '../../modules/files/files.controller';

const app = fastify();

app.register(new FilesRoutes(new FilesController()).getRoutes, {
  prefix: 'files',
});

app
  .listen({
    port: env.APP_PORT,
  })
  .then(() => {
    console.log(`HTTP server is running on port ${env.APP_PORT}!`);
  });
