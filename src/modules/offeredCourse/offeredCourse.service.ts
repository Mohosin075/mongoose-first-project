import httpStatus from 'http-status';
import AppError from '../../error/AppError';
import { SemesterRegistration } from '../semesterRegistration/semesterRegistration.model';
import { TOfferedCourse } from './offeredCourse.interface';
import { OfferedCourse } from './offeredCourse.model';
import { AcademicFaculty } from '../academicFaculty/academicFaculty.model';
import { AcademicDepartment } from '../academicDepartment/academicDepartment.model';
import { Course } from '../course/course.model';
import { Faculty } from '../Faculty/faculty.model';
import hasTimeConflict from './offeredCourse.utils';

const createOfferedCourseInoDB = async (payload: TOfferedCourse) => {
  const {
    semesterRegistration,
    academicFaculty,
    section,
    academicDepartment,
    course,
    faculty,
    days,
    startTime,
    endTime,
  } = payload;

  const isSemesterRegistrationExists =
    await SemesterRegistration.findById(semesterRegistration);

  const academicSemester = isSemesterRegistrationExists?.academicSemester;

  if (!isSemesterRegistrationExists) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'this semester registration not found!',
    );
  }

  const isAcademicFacultyExists =
    await AcademicFaculty.findById(academicFaculty);
  if (!isAcademicFacultyExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'academic faculty not found!');
  }

  const isAcademicDepartmentExists =
    await AcademicDepartment.findById(academicDepartment);
  if (!isAcademicDepartmentExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'academic Department not found!');
  }

  const isCourseExists = await Course.findById(course);
  if (!isCourseExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'course not found!');
  }

  const isFacultyExists = await Faculty.findById(faculty);
  if (!isFacultyExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'faculty not found!');
  }

  const isDepartmentBelongToFaculty = await AcademicDepartment.findOne({
    _id: academicDepartment,
    academicFaculty,
  });

  if (!isDepartmentBelongToFaculty) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      `${isAcademicDepartmentExists.name} is not belong to ${isAcademicFacultyExists.name} !`,
    );
  }

  // if the same offered course same section in same registered semester exist

  const isSameOfferedCourseExistsWithSameRegisteredSemesterWithSameSection =
    await OfferedCourse.findOne({
      semesterRegistration,
      course,
      section,
    });

  if (isSameOfferedCourseExistsWithSameRegisteredSemesterWithSameSection) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      `Offered course with same section already exists!`,
    );
  }

  // get the schedule of the faculties

  const assignSchedule = await OfferedCourse.find({
    semesterRegistration,
    faculty,
    days: { $in: days },
  }).select('days startTime endTime');

  const newSchedule = {
    days,
    startTime,
    endTime,
  };

  if (hasTimeConflict(assignSchedule, newSchedule)) {
    throw new AppError(
      httpStatus.CONFLICT,
      `The faculty is not available is that time ! Choose other time or date.`,
    );
  }

  const result = await OfferedCourse.create({ ...payload, academicSemester });

  return result;
};

const getAllOfferedCourseFromDb = async () => {
  const result = await OfferedCourse.find();
  return result;
};

const getSingleOfferedCourseInoDB = async (id: string) => {
  const result = await OfferedCourse.findById(id).populate(
    'semesterRegistration',
  );
  return result;
};

const deleteOfferedCourseInoDB = async (id: string) => {
  const isOfferedCourseExist = await OfferedCourse.findById(id).populate(
    'semesterRegistration',
  );

  if (!isOfferedCourseExist) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'This offered course is not found!',
    );
  }

  // check semester registration status is upcoming

  const semesterRegistration = await SemesterRegistration.findById(
    isOfferedCourseExist.semesterRegistration,
  ).select('status');

  const semesterRegistrationStatus = semesterRegistration?.status;

  if (semesterRegistrationStatus !== 'UPCOMING') {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `You can not delete this semester in status : ${semesterRegistrationStatus}`,
    );
  }

  const result = await OfferedCourse.findByIdAndDelete(id);

  return result;
};

const updateOfferedCourseInoDB = async (
  id: string,
  payload: Pick<TOfferedCourse, 'faculty' | 'startTime' | 'endTime' | 'days'>,
) => {
  const { faculty, days, startTime, endTime } = payload;

  const isOfferedCourseExists = await OfferedCourse.findById(id);
  if (!isOfferedCourseExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Offered course not found!');
  }

  const isFaculty = await Faculty.findById(faculty);
  if (!isFaculty) {
    throw new AppError(httpStatus.NOT_FOUND, 'Faculty not found!');
  }

  const semesterRegistration = isOfferedCourseExists.semesterRegistration;

  const semesterRegistrationStatus =
    await SemesterRegistration.findById(semesterRegistration);

  if (semesterRegistrationStatus?.status !== 'UPCOMING') {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `You can't update this offered course as it is ${semesterRegistrationStatus?.status}`,
    );
  }

  // get the schedule of the faculties

  const assignSchedule = await OfferedCourse.find({
    semesterRegistration,
    faculty,
    days: { $in: days },
  }).select('days startTime endTime');

  const newSchedule = {
    days,
    startTime,
    endTime,
  };

  if (hasTimeConflict(assignSchedule, newSchedule)) {
    throw new AppError(
      httpStatus.CONFLICT,
      `The faculty is not available is that time ! Choose other time or date.`,
    );
  }

  const result = await OfferedCourse.findByIdAndUpdate(id, payload, {
    new: true,
  });

  return result;
};

export const OfferedCourseServices = {
  createOfferedCourseInoDB,
  getAllOfferedCourseFromDb,
  updateOfferedCourseInoDB,
  getSingleOfferedCourseInoDB,
  deleteOfferedCourseInoDB,
};
