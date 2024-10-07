import { model, Schema } from 'mongoose';
import { TUser, UserModel } from './user.interface';
import config from '../../app/config';
import bcrypt from 'bcrypt';
import { USER_STATUS } from './user.constant';
const userSchema = new Schema<TUser, UserModel>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: 0
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
      enum: USER_STATUS,
      default: 'in-progress',
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    passwordChangeAt :{
      type : Date
    }
  },
  {
    timestamps: true,
  },
);

// pre save middleware/hooks : will work on create() or save() function

userSchema.pre('save', async function (next) {
  // console.log(this, 'pre hook : we will save data');

  const user = this;

  user.password = await bcrypt.hash(
    user.password,
    Number(config.bcrypt_salt_round),
  );

  next();
});

// post save middleware/hooks

userSchema.post('save', function (doc, next) {
  doc.password = '';

  next();
});


userSchema.statics.isUserExistByCustomId = async function(id : string){
  return await User.findOne({id}).select('+password')
}

userSchema.statics.isPasswordMatched = async function(plaintextPassword, hashedPassword){

  return await bcrypt.compare(plaintextPassword, hashedPassword)

}

userSchema.statics.isJWTIssuedBeforePasswordChanged = function(passwordChangedTimestamp : Date, jwtIssuedTimestamp : number){
  const passwordChangeTime =new Date(passwordChangedTimestamp).getTime() / 1000

  return passwordChangeTime > jwtIssuedTimestamp

}



export const User = model<TUser, UserModel>('User', userSchema);
