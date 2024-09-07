import { Schema, model } from 'mongoose';
import { TAcademicDepartment } from './academicDepartment.interface';
import AppError from '../../error/AppError';
import httpStatus from 'http-status';

const AcademicDepartmentSchema = new Schema<TAcademicDepartment>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    academicFaculty: {
      type: Schema.Types.ObjectId,
      ref : "AcademicFaculty"
    },
  },
  {
    timestamps: true,
  },
);

// AcademicDepartmentSchema.pre('save', async function (next) {
//   const isDepartmentExist = await AcademicDepartment.findOne({
//     name: this.name,
//   });

//   if (isDepartmentExist) {
//     throw new AppError(httpStatus.NOT_FOUND,'This department is already exist ');
//   }
//   next();
// });



// for update validation - use Query
AcademicDepartmentSchema.pre('findOneAndUpdate', async function (next) {
  const query = this.getQuery();

  console.log(query);

  const isDepartmentExist = await AcademicDepartment.findOne({
    query
  });

  if (!isDepartmentExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'This department does not exist');
  }

  next();
});

export const AcademicDepartment = model<TAcademicDepartment>(
  'AcademicDepartment',
  AcademicDepartmentSchema,
);
