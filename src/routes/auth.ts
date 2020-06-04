import Router from 'koa-router'
import User from '../models/user'
import crypto from 'crypto'
import { config } from '../config'
import jwt from 'jsonwebtoken'
import { Context } from 'koa'

const router = new Router()

// Authenticate
router.post('/api/auth', async (ctx: Context) => {
  try {
    ctx.request.headers
    // ctx.body = ctx.request.headers.authorization.split(" ")[1], 'base64').toString()
    const basicAuth = new Buffer(
      ctx.request.headers.authorization.split(' ')[1],
      'base64',
    ).toString()
    const [email, password] = basicAuth.split(':')

    let user = await User.findOne({ email })

    if (user) {
      const hashedPassword = crypto
        .createHmac('sha1', config.salt)
        .update(password)
        .digest('hex')

      if (hashedPassword === user.password) {
        // generate token
        let token = jwt.sign({ id: user._id }, config.jwtSecret, {
          expiresIn: '1d',
        })
        ctx.body = { token }
      } else {
        ctx.body = 'wrong pass'
      }
    } else {
      ctx.body = null
    }
  } catch (err) {
    ctx.body = err
  }
})

export default router
