import httpStatus from 'http-status';
import AppError from '../../error/AppError';
import { User } from '../user/user.model';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../../app/config';
import bcrypt from 'bcrypt';
import { createToken,  verifyToken } from './auth.utils';
import { sendEmail } from '../../utils/sendMail';

const loginUser = async (payload: TLoginUser) => {
  const user = await User?.isUserExistByCustomId(payload?.id);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found!');
  }

  // check the user is already deleted

  const isDeleted = user?.isDeleted;

  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted!');
  }

  const userStatus = user?.status;

  if (userStatus === 'blocked') {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked!');
  }

  //   checking if the password is correct

  if (!(await User?.isPasswordMatched(payload?.password, user?.password))) {
    throw new AppError(httpStatus.FORBIDDEN, 'Password do not match!');
  }

  //   access granted , sent access token, refresh token

  const jwtPayload = {
    id: user?.id,
    role: user?.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expiresIn as string,
  );

  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expiresIn as string,
  );

  return {
    accessToken,
    refreshToken,
    needsPasswordChange: user?.needsPasswordChange,
  };
};

const changePassword = async (
  userData: JwtPayload,
  payload: { oldPassword: string; newPassword: string },
) => {
  const user = await User?.isUserExistByCustomId(userData?.id);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found!');
  }

  // check the user is already deleted

  const isDeleted = user?.isDeleted;

  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted!');
  }

  const userStatus = user?.status;

  if (userStatus === 'blocked') {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked!');
  }

  //   checking if the password is correct

  if (!(await User?.isPasswordMatched(payload?.oldPassword, user?.password))) {
    throw new AppError(httpStatus.FORBIDDEN, 'Password do not match!');
  }

  const newHashedPassword = await bcrypt.hash(
    payload?.newPassword,
    Number(config.bcrypt_salt_round),
  );

  await User.findOneAndUpdate(
    {
      id: userData?.id,
      role: userData?.role,
    },
    {
      password: newHashedPassword,
      needsPasswordChange: false,
      passwordChangeAt: new Date(),
    },
  );

  return null;
};

const refreshToken = async (token: string) => {
  const decoded = verifyToken(token, config.jwt_refresh_secret as string);

  const { id, iat } = decoded;

  const user = await User?.isUserExistByCustomId(id);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found!');
  }

  // check the user is already deleted

  const isDeleted = user?.isDeleted;

  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted!');
  }

  const userStatus = user?.status;

  if (userStatus === 'blocked') {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked!');
  }

  if (
    user?.passwordChangeAt &&
    User.isJWTIssuedBeforePasswordChanged(user?.passwordChangeAt, iat as number)
  ) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'This user is not authorized!');
  }

  const jwtPayload = {
    id: user?.id,
    role: user?.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expiresIn as string,
  );

  return {
    accessToken
  }
};

const forgetPassword =async(id : string)=>{

  const user = await User?.isUserExistByCustomId(id);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found!');
  }

  // check the user is already deleted

  const isDeleted = user?.isDeleted;

  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted!');
  }

  const userStatus = user?.status;

  if (userStatus === 'blocked') {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked!');
  }

  const jwtPayload = {
    id: user?.id,
    role: user?.role,
  };

  const resetToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    '10m'
  );

  const resetUILink = `${config.reset_pass_ui_link}?id=${user.id}&token=${resetToken}`

  sendEmail(user?.email, resetUILink);
}

const resetPassword =async(payload : {id : string, newPassword : string}, token : string )=>{


  const user = await User?.isUserExistByCustomId(payload.id);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found!');
  }

  // check the user is already deleted

  const isDeleted = user?.isDeleted;

  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted!');
  }

  const userStatus = user?.status;

  if (userStatus === 'blocked') {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked!');
  }


  const decoded = jwt.verify(
    token,
    config.jwt_access_secret as string,
  ) as JwtPayload;

  if(payload.id !== decoded.id){
    throw new AppError(httpStatus.FORBIDDEN, 'You are forbidden!')
  }

  const newHashedPassword = await bcrypt.hash(
    payload?.newPassword,
    Number(config.bcrypt_salt_round),
  );

  await User.findOneAndUpdate(
    {
      id: decoded?.id,
      role: decoded?.role,
    },
    {
      password: newHashedPassword,
      needsPasswordChange: false,
      passwordChangeAt: new Date(),
    },
  );

}

export const AuthServices = {
  loginUser,
  changePassword,
  refreshToken,
  forgetPassword,
  resetPassword
};
