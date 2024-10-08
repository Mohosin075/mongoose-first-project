import mongoose from 'mongoose';
import { TStudent } from './student.interface';
import { Student } from './student.model';
import AppError from '../../error/AppError';
import httpStatus from 'http-status';
import { User } from '../user/user.model';
import QueryBuilder from '../../builder/QueryBuilder';
import { studentSearchAbleField } from './student.constant';

const getAllStudentsFromDB = async (query: Record<string, unknown>) => {
  //   const queryObj = {...query} //copy

  //   let searchTerm = '';

  //   if(query?.searchTerm){
  //     searchTerm = query?.searchTerm as string;
  //   }

  //   const studentSearchAbleField = ['email', 'name.lastName', 'presentAddress'];

  //   const searchQuery = Student.find({
  //     $or: studentSearchAbleField.map(field => ({
  //         [field]: { $regex: searchTerm, $options: 'i' }
  //     }))
  // })

  // // filtering

  //   const excludeFields = ['searchTerm', 'sort', 'limit', 'page', 'fields'];

  //   excludeFields.forEach(el =>delete queryObj[el])

  //   console.log(query);

  //   const filterQuery = searchQuery.find(queryObj)
  //     .populate('academicSemester')
  //     .populate({
  //       path: 'academicDepartment',
  //       populate: {
  //         path: 'academicFaculty',
  //       },
  //     });

  // let sort = 'createdAt';

  // if(query?.sort){
  //   sort = query.sort as string
  // }

  // const sortQuery = filterQuery.sort(sort);

  // let page = 1;
  // let limit = 1;
  // let skip = 0

  // if(query?.limit){
  //   limit = query.limit as number
  // }

  // if(query?.page){
  //   page = query.page as number
  //   skip = (page - 1 ) * limit
  // }

  // const paginateQuery = sortQuery.skip(skip)

  // const limitQuery = paginateQuery.limit(limit);

  // // field limiting

  // let fields = '__v'

  // if(query?.fields){
  //   fields = (query.fields as string as string).split(',').join(' ')
  // }

  // const fieldQuery = await limitQuery.select(fields)

  const studentQuery = new QueryBuilder(
    Student.find()
      .populate('user')
      .populate('academicSemester')
      .populate({
        path: 'academicDepartment',
        populate: {
          path: 'academicFaculty',
        },
      }),
    query,
  )
    .search(studentSearchAbleField)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await studentQuery.modelQuery;
  const meta =await studentQuery.countTotal();

  return { meta, result };
};

const getSingleStudentFromDB = async (id: string) => {
  // const result = await Student.findOne({id})

  const result = await Student.findById(id).populate({
    path: 'academicDepartment',
    populate: {
      path: 'academicFaculty',
    },
  });

  return result;
};

const updateStudentIntoDB = async (id: string, payload: Partial<TStudent>) => {
  // const result = await Student.findOne({id})
  const { name, guardian, localGuardian, ...remainingStudentData } = payload;

  const modifiedUpdatedData: Record<string, unknown> = {
    ...remainingStudentData,
  };

  if (name && Object.keys(name).length) {
    for (const [key, value] of Object.entries(name)) {
      modifiedUpdatedData[`name.${key}`] = value;
    }
  }
  if (localGuardian && Object.keys(localGuardian).length) {
    for (const [key, value] of Object.entries(localGuardian)) {
      modifiedUpdatedData[`localGuardian.${key}`] = value;
    }
  }
  if (guardian && Object.keys(guardian).length) {
    for (const [key, value] of Object.entries(guardian)) {
      modifiedUpdatedData[`guardian.${key}`] = value;
    }
  }

  console.log(modifiedUpdatedData);

  const result = await Student.findByIdAndUpdate(id, modifiedUpdatedData, {
    new: true,
    runValidators: true,
  });

  return result;
};

const deleteStudentFromDB = async (id: string) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const deletedStudent = await Student.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true, session },
    );

    if (!deletedStudent) {
      throw new AppError(httpStatus.BAD_REQUEST, 'fail to deleted student');
    }

    const userId = deletedStudent.user;
    const deletedUser = await User.findByIdAndUpdate(
      userId,
      { isDeleted: true },
      { new: true, session },
    );

    if (!deletedUser) {
      throw new AppError(httpStatus.BAD_REQUEST, 'fail to deleted User');
    }

    await session.commitTransaction();
    await session.endSession();

    return deletedStudent;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw error;
  }
};

export const StudentServices = {
  getAllStudentsFromDB,
  getSingleStudentFromDB,
  deleteStudentFromDB,
  updateStudentIntoDB,
};
