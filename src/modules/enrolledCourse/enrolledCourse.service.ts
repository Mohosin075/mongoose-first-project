import httpStatus from 'http-status';
import AppError from '../../error/AppError';
import { OfferedCourse } from '../offeredCourse/offeredCourse.model';
import EnrolledCourse from './enrolledCourse.model';
import { Student } from '../student/student.model';
import { startSession } from 'mongoose';
import { SemesterRegistration } from '../semesterRegistration/semesterRegistration.model';
import { Course } from '../course/course.model';
import { TEnrolledCourse } from './enrolledCourse.interface';
import { Faculty } from '../Faculty/faculty.model';
import { object } from 'joi';
import { calculateGradeAndPoints } from './enrolledCourse.utils';

const createEnrolledCourseIntoDB = async (
  userId: string,
  payload: { offeredCourse: string },
) => {
  /** 
    1. check if the offered course is exists.
    2. if the student is already enrolled.
    3. if the max credits is exceeds
    4. create an enrolled course
    */

  const { offeredCourse } = payload;

  const isOfferedCourseIsExists = await OfferedCourse.findById({
    _id: offeredCourse,
  });

  if (!isOfferedCourseIsExists) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'This offered course is not found!',
    );
  }

  if (isOfferedCourseIsExists.maxCapacity <= 0) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Room is full!');
  }

  const student = await Student.findOne({ id: userId }, { _id: 1 });

  if (!student) {
    throw new AppError(httpStatus.NOT_FOUND, 'student is not found!');
  }

  const isStudentAlreadyEnrolled = await EnrolledCourse.findOne({
    semesterRegistration: isOfferedCourseIsExists.semesterRegistration,
    offeredCourse,
    student: student?._id,
  });

  if (isStudentAlreadyEnrolled) {
    throw new AppError(httpStatus.CONFLICT, 'student already enrolled!');
  }

  const course = await Course.findById(isOfferedCourseIsExists.course);

  // check total credits exceeds maxCredit

  const semesterRegistration = await SemesterRegistration.findById(
    isOfferedCourseIsExists.semesterRegistration,
  ).select('maxCredit');

  const maxCredits = semesterRegistration?.maxCredit;

  // total enrolled credits + new enrolled course credits > max credits

  const enrolledCourse = await EnrolledCourse.aggregate([
    {
      $match: {
        semesterRegistration: isOfferedCourseIsExists.semesterRegistration,
        student: student._id,
      },
    },
    {
      $lookup: {
        from: 'courses',
        localField: 'course',
        foreignField: '_id',
        as: 'enrolledCourseData',
      },
    },
    {
      $unwind: '$enrolledCourseData',
    },
    {
      $group: {
        _id: null,
        totalEnrolledCredits: { $sum: '$enrolledCourseData.credits' },
      },
    },
    {
      $project: {
        _id: 0,
        totalEnrolledCredits: 1,
      },
    },
  ]);

  const totalCredits =
    enrolledCourse.length > 0 ? enrolledCourse[0].totalEnrolledCredits : 0;

  // console.log(totalCredits);

  if (
    totalCredits &&
    maxCredits &&
    totalCredits + course?.credits > maxCredits
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'You have exceeded maximum number of credits.',
    );
  }

  const session = await startSession();

  try {
    session.startTransaction();
    const result = await EnrolledCourse.create(
      [
        {
          semesterRegistration: isOfferedCourseIsExists.semesterRegistration,
          academicSemester: isOfferedCourseIsExists.academicSemester,
          academicFaculty: isOfferedCourseIsExists.academicFaculty,
          academicDepartment: isOfferedCourseIsExists.academicDepartment,
          offeredCourse: offeredCourse,
          course: isOfferedCourseIsExists.course,
          student: student._id,
          faculty: isOfferedCourseIsExists.faculty,
          isEnrolled: true,
        },
      ],
      { session },
    );

    if (!result) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'failed to enrolled this course!',
      );
    }

    const maxCapacity = isOfferedCourseIsExists.maxCapacity;

    await OfferedCourse.findByIdAndUpdate(
      offeredCourse,
      {
        maxCapacity: maxCapacity - 1,
      },
      { session },
    );

    await session.commitTransaction();
    await session.endSession();

    return result;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw error;
  }
};

const updateEnrolledCourseMarks = async (
  facultyId: string,
  payload: Partial<TEnrolledCourse>,
) => {
  const { semesterRegistration, offeredCourse, student, courseMarks } = payload;

  const semesterRegistrationExists =
    await SemesterRegistration.findById(semesterRegistration);

  if (!semesterRegistrationExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'semesterRegistration not found!');
  }

  const isOfferedCourseIsExists = await OfferedCourse.findById(offeredCourse);

  if (!isOfferedCourseIsExists) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'This offered course is not found!',
    );
  }

  const isStudentExists = await Student.findById(student);

  // console.log(student);

  if (!isStudentExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Student not found!');
  }

  const faculty = await Faculty.findOne({ id: facultyId }, { _id: 1 });

  if (!faculty) {
    throw new AppError(httpStatus.NOT_FOUND, 'Faculty not found!');
  }

  const isCourseBelongToFaculty = await EnrolledCourse.findOneAndUpdate({
    semesterRegistration,
    offeredCourse,
    student,
    faculty: faculty?._id,
  });

  if (!isCourseBelongToFaculty) {
    throw new AppError(httpStatus.FORBIDDEN, 'You are forbidden!');
  }

  const modifiedData: Record<string, unknown> = {
    ...courseMarks,
  };

  if (courseMarks?.finalTerm) {
    const { classTest1, midTerm, classTest2, finalTerm } =
      isCourseBelongToFaculty.courseMarks;

    const totalMarks =
      Math.ceil(classTest1) +
      Math.ceil(midTerm) +
      Math.ceil(classTest2) +
      Math.ceil(finalTerm);

    const result = calculateGradeAndPoints(totalMarks);

    modifiedData.grade = result.grade;
    modifiedData.gradePoints = result.gradePoint;
    modifiedData.isCompleted = true;
  }

  if (courseMarks && Object.keys(courseMarks).length) {
    for (const [key, value] of Object.entries(courseMarks)) {
      modifiedData[`courseMarks.${key}`] = value;
    }
  }

  const result = await EnrolledCourse.findByIdAndUpdate(
    isCourseBelongToFaculty._id,
    modifiedData,
    {
      new: true,
    },
  );

  return result;
};

export const EnrolledCourseServices = {
  createEnrolledCourseIntoDB,
  updateEnrolledCourseMarks,
};
