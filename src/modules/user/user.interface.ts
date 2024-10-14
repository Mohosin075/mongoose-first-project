import { Model } from "mongoose";
import { USER_ROLE } from "./user.constant";

export interface TUser {
  id: string;
  email : string,
  password: string;
  needsPasswordChange: boolean;
  role: 'superAdmin' | 'admin' | 'student' | 'faculty';
  status: 'in-progress' | 'blocked';
  isDeleted: boolean;
  passwordChangeAt ?: Date
};

export interface UserModel extends Model<TUser> {
  // myStaticMethod(): number;

  isUserExistByCustomId(id : string) : Promise<TUser>
  isPasswordMatched(plaintextPassword : string, hashedPassword: string) : Promise<boolean>
  isJWTIssuedBeforePasswordChanged(passwordChangedTimestamp : Date, jwtIssuedTimestamp : number) : boolean
}

export type TUserRole = keyof typeof USER_ROLE
