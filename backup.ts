require('dotenv').config()
import Koa from 'koa'
import Router from 'koa-router'

import logger from 'koa-logger'
import json from 'koa-json'
import bodyParser from 'koa-bodyparser'

import mongoose from 'mongoose'

// DB
const mongooseOptions = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
}

const mongoDbUri: string = process.env['MONGO_URI'] as string
mongoose.connect(mongoDbUri, mongooseOptions)

const app = new Koa()
const router = new Router()

router.get('/test', (ctx) => {
  // console.log(ctx)
  ctx.body = 'test app'
})

router.post('/sample', async (ctx, next) => {
  const data = ctx.request.body
  ctx.body = { data }
  await next()
})

// Middlewares
app.use(json())
app.use(logger())
app.use(bodyParser())

// Routes
app.use(router.routes()).use(router.allowedMethods())

app.listen(3000)
