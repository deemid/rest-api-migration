/* eslint-disable no-console */
/* eslint-disable consistent-return */

import Router from 'koa-router';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { Context, Next } from 'koa';
import { Document } from 'mongoose';
import { config } from '../config';
import User, { IUser } from '../models/user';

const generateHash = (password: string): string => crypto.createHmac('sha1', config.salt).update(password).digest('hex');

const parseToken = async (ctx: Context, next: Next) => {
  const auth = ctx.request.headers.authorization;
  console.log({ auth });
  if (!auth) {
    return next();
  }

  const token = auth.split('Bearer ')[1];

  // parse token
  if (token) {
    const decoded = jwt.verify(token, config.jwtSecret);

    if (decoded) {
      // ***** TODO: remove 'as any' *****
      const user = await User.findById((decoded as any).id);
      ctx.state.currentUser = user;
    }
  }

  await next();
};

const requireUser = async (ctx: Context, next: Next) => {
  if (!ctx.state.currentUser) {
    ctx.status = 401;
    ctx.body = {
      message: 'Unauthorized',
    };
  } else {
    await next();
  }
};

const router = new Router({
  prefix: '/users',
});

// Get All Users
router.get('/', async (ctx: Context) => {
  try {
    const users = await User.find();
    ctx.body = users;
  } catch (err) {
    ctx.body = err;
  }
});

// Create User
router.post('/', async (ctx: Context) => {
  try {
    const { password } = ctx.request.body;
    const hashedPassword = generateHash(password);
    ctx.request.body.password = hashedPassword;

    const user = await User.create(ctx.request.body);
    ctx.body = user;
  } catch (err) {
    ctx.body = err;
  }
});

// Update own information
router.patch('/', parseToken, requireUser, async (ctx: Context) => {
  const { body } = ctx.request;
  const user: IUser & Document = ctx.state.currentUser;

  if (body.name) {
    user.name = body.name;
  }

  if (body.password) {
    const hashedPassword = generateHash(body.password);
    user.password = hashedPassword;
  }

  await user.save();
  ctx.body = user;
});

// Get Single User by Id
router.get('/:id', parseToken, requireUser, async (ctx: Context) => {
  const user = await User.findById(ctx.params.id);
  if (user) {
    ctx.body = user;
  } else {
    ctx.status = 404;
    ctx.body = 'User does not exist';
  }
});

export default router;
