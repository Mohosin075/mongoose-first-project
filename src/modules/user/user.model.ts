
import { model, Schema } from 'mongoose';
import { TUser } from './user.interface';
import config from '../../app/config';
import bcrypt from 'bcrypt'
const userSchema = new Schema<TUser>(
  {
    id: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    needsPasswordChange: {
      type: Boolean,
      default: true,
    },
    role: {
      type: String,
      enum: ['student', 'faculty', 'admin'],
    },
    status: {
      type: String,
      enum: ['in-progress', 'blocked'],
      default: 'in-progress',
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);


// pre save middleware/hooks : will work on create() or save() function

userSchema.pre('save', async function(next){
  // console.log(this, 'pre hook : we will save data');

  const user = this

  user.password =  await bcrypt.hash(user.password, Number(config.bcrypt_salt_round))

  next()

})

// post save middleware/hooks

userSchema.post('save', function(doc, next){
  
  doc.password =  ''

  next()
})



export const User = model<TUser>('User', userSchema)