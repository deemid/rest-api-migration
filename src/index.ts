/* eslint-disable no-console */
// require('dotenv').config()
import Koa from 'koa';
import Router from 'koa-router';
import logger from 'koa-logger';
import json from 'koa-json';
import bodyParser from 'koa-bodyparser';

import { config } from './config';
import healthCheckRoutes from './routes/healthcheck';
import userRoutes from './routes/users';
import authRoutes from './routes/auth';
import initializeDb from './db';

const app = new Koa();
const router = new Router();

initializeDb();

// Middlewares
app.use(json());
app.use(logger());
app.use(bodyParser());

app.use(healthCheckRoutes.routes());
app.use(userRoutes.routes());
app.use(authRoutes.routes());

// Routes
app.use(router.routes()).use(router.allowedMethods());

const server = app
  .listen(config.port, async () => {
    console.log(`Listening on port ${config.port}`);
  })
  .on('error', (err) => {
    console.log(err);
  });

export default server;
