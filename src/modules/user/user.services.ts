import config from '../../app/config';
import { TStudent } from '../student/student.interface';
import { TNewUser } from './user.interface';
import { User } from './user.model';
import { Student } from './../student/student.model';
import { TAcademicSemester } from '../academicSemester/academicSemester.interface';
import { AcademicSemester } from '../academicSemester/academicSemester.model';
import { generateStudentId } from './user.utils';
import mongoose from 'mongoose';
import AppError from '../../error/AppError';
import httpStatus from 'http-status';

const createStudentIntoDB = async (password: string, payload: TStudent) => {
  const session =await mongoose.startSession();

  try {

    session.startTransaction();
    //    create a new user
    const userData: TNewUser = {};
    // default pass set
    userData.password = password || (config.default_pass as string);
    // set user role
    userData.role = 'student';

    // set generated id
    // find academic semester info
    const admissionSemesterData = await AcademicSemester.findById(
      payload.academicSemester,
    );

    userData.id = await generateStudentId(admissionSemesterData);

    // create a user (transaction - 1)
    const newUser = await User.create([userData], { session });

    console.log(newUser);

    if (!newUser) {
      throw new AppError(httpStatus.BAD_REQUEST, 'failed to create user');
    }

    if (newUser.length) {
      console.log(payload);
      (payload.id = newUser[0].id), (payload.user = newUser[0]._id);

      // create a student (transaction - 2)
      const newStudent = await Student.create([payload], { session });

      if (!newStudent.length) {
        throw new AppError(httpStatus.BAD_REQUEST, 'failed to create student');
      }

      console.log(newStudent);
      session.commitTransaction();
      session.endSession();


      return newStudent;
    }
  } catch (error) {
    console.error("Error creating student:", error);
    await session.abortTransaction();
    await session.endSession()
    throw error;
    
  
  }

  // return newUser
};

export const UserServices = {
  createStudentIntoDB,
};
