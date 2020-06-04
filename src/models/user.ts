import mongoose, { Schema, Document } from 'mongoose'
import { v4 } from 'uuid'
import uniqueValidator from 'mongoose-unique-validator'

export type IUser = {
  email: string
  password: string
  name?: string
}

const UserSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: false },
  _id: { type: String, default: v4 },
})

UserSchema.plugin(uniqueValidator)

export default mongoose.model<IUser & Document>('User', UserSchema)
