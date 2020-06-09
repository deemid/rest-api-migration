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
// import graphqlRoute from './routes/graphql';
import initializeDb from './db';
import createApolloServer from './createApolloServer';

const app = new Koa();
const router = new Router();

initializeDb();

// Middlewares
app.use(json());
app.use(logger());
app.use(bodyParser());

app.use(healthCheckRoutes.routes());
// app.use(graphqlRoute.routes());
app.use(userRoutes.routes());
app.use(authRoutes.routes());

// Routes
app.use(router.routes()).use(router.allowedMethods());
const apolloServer = createApolloServer(app);

const server = app
  .listen(config.port, async () => {
    console.log(`🚀 Server ready at http://localhost:4000${apolloServer.graphqlPath}`);
  })
  .on('error', (err) => {
    console.log(err);
  });

export default server;
