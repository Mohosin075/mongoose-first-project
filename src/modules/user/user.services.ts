import config from '../../app/config';
import { TStudent } from '../student/student.interface';
import { TUser } from './user.interface';
import { User } from './user.model';
import { Student } from './../student/student.model';
import { AcademicSemester } from '../academicSemester/academicSemester.model';
import {
  generateAdminId,
  generateFacultyId,
  generateStudentId,
} from './user.utils';
import mongoose from 'mongoose';
import AppError from '../../error/AppError';
import httpStatus from 'http-status';
import { TFaculty } from '../Faculty/faculty.interface';
import { AcademicDepartment } from '../academicDepartment/academicDepartment.model';
import { Faculty } from '../Faculty/faculty.model';
import { Admin } from '../Admin/admin.model';
import { verifyToken } from '../Auth/auth.utils';
import { sendImageToCloudinary } from '../../utils/sendImageToCloudinary';

const createStudentIntoDB = async (
  file: any,
  password: string,
  payload: TStudent,
) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    //    create a new user
    const userData: Partial<TUser> = {};
    // default pass set
    userData.password = password || (config.default_pass as string);
    // set user role
    userData.role = 'student';
    userData.email = payload.email;

    // set generated id
    // find academic semester info
    const admissionSemesterData = await AcademicSemester.findById(
      payload.academicSemester,
    );

    if (admissionSemesterData) {
      userData.id = await generateStudentId(admissionSemesterData);
    }

    // send image in cloudinary

    const imageName = `${userData.id}${payload?.name?.firstName}`;
    const path = file?.path;

    const { secure_url } = await sendImageToCloudinary(imageName, path);

    // create a user (transaction - 1)
    const newUser = await User.create([userData], { session });

    // console.log(newUser);

    if (!newUser) {
      throw new AppError(httpStatus.BAD_REQUEST, 'failed to create user');
    }

    if (newUser.length) {
      // console.log(payload);
      (payload.id = newUser[0].id), (payload.user = newUser[0]._id);
      payload.profileImg = secure_url;

      // create a student (transaction - 2)
      const newStudent = await Student.create([payload], { session });

      if (!newStudent.length) {
        throw new AppError(httpStatus.BAD_REQUEST, 'failed to create student');
      }

      // console.log(newStudent);
      session.commitTransaction();
      session.endSession();

      return newStudent;
    }
  } catch (error) {
    console.error('Error creating student:', error);
    await session.abortTransaction();
    await session.endSession();
    throw error;
  }
};

const createFacultyIntoDB = async (
  file: any,
  password: string,
  payload: TFaculty,
) => {
  // create a user object
  const userData: Partial<TUser> = {};

  //if password is not given , use deafult password
  userData.password = password || (config.default_pass as string);

  //set student role
  userData.role = 'faculty';
  userData.email = payload.email;

  // find academic department info
  const academicDepartment = await AcademicDepartment.findById(
    payload.academicDepartment,
  );

  if (!academicDepartment) {
    throw new AppError(400, 'Academic department not found');
  }

  const imageName = `${userData.id}${payload?.name?.firstName}`;
  const path = file?.path;

  const { secure_url } = await sendImageToCloudinary(imageName, path);

  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    //set  generated id
    userData.id = await generateFacultyId();
    payload.profileImg = secure_url;

    // create a user (transaction-1)
    const newUser = await User.create([userData], { session }); // array

    //create a faculty
    if (!newUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create user');
    }
    // set id , _id as user
    payload.id = newUser[0].id;
    payload.user = newUser[0]._id; //reference _id

    // create a faculty (transaction-2)

    const newFaculty = await Faculty.create([payload], { session });

    if (!newFaculty.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create faculty');
    }

    await session.commitTransaction();
    await session.endSession();

    return newFaculty;
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};

const createAdminIntoDB = async (
  file: any,
  password: string,
  payload: TFaculty,
) => {
  // create a user object
  const userData: Partial<TUser> = {};

  //if password is not given , use deafult password
  userData.password = password || (config.default_pass as string);

  //set student role
  userData.role = 'admin';
  userData.email = payload.email;

  const imageName = `${userData.id}${payload?.name?.firstName}`;
  const path = file?.path;


  const { secure_url } = await sendImageToCloudinary(imageName, path);

  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    //set  generated id
    userData.id = await generateAdminId();
    payload.profileImg = secure_url;

    // create a user (transaction-1)
    const newUser = await User.create([userData], { session });

    //create a admin
    if (!newUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create admin');
    }
    // set id , _id as user
    payload.id = newUser[0].id;
    payload.user = newUser[0]._id; //reference _id

    // create a admin (transaction-2)
    const newAdmin = await Admin.create([payload], { session });

    if (!newAdmin.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create admin');
    }

    await session.commitTransaction();
    await session.endSession();

    return newAdmin;
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};

const getMe = async (userId: string, role: string) => {
  let result = null;

  if (role === 'student') {
    result = await Student.findOne({ id: userId }).populate('user');
  }
  if (role === 'faculty') {
    result = await Faculty.findOne({ id: userId }).populate('user');
  }
  if (role === 'admin') {
    result = await Admin.findOne({ id: userId }).populate('user');
  }

  return result;
};

const changeStatus = async (id: string, payload: { status: string }) => {
  const result = await User.findByIdAndUpdate(id, payload, {
    new: true,
  });

  return result;
};

export const UserServices = {
  createStudentIntoDB,
  createAdminIntoDB,
  createFacultyIntoDB,
  getMe,
  changeStatus,
};
