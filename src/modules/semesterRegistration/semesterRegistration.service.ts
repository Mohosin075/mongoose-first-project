import httpStatus from 'http-status';
import AppError from '../../error/AppError';
import { AcademicSemester } from '../academicSemester/academicSemester.model';
import { TSemesterRegistration } from './semesterRegistration.interface';
import { SemesterRegistration } from './semesterRegistration.model';
import QueryBuilder from '../../builder/QueryBuilder';
import { RegistrationStatus } from './semesterRegistration.constant';
import { OfferedCourse } from '../offeredCourse/offeredCourse.model';
import { startSession } from 'mongoose';

const createSemesterRegistrationInoDB = async (
  payload: TSemesterRegistration,
) => {
  const academicSemester = payload.academicSemester;

  const isThereAnyUpcomingOrOngoingSemester =
    await SemesterRegistration.findOne({
      $or: [
        { status: RegistrationStatus.UPCOMING },
        { status: RegistrationStatus.ONGOING },
      ],
    });

  if (isThereAnyUpcomingOrOngoingSemester) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `there is already an ${isThereAnyUpcomingOrOngoingSemester.status} registered semester.`,
    );
  }

  const isAcademicSemesterExists =
    await AcademicSemester.findById(academicSemester);

  if (!isAcademicSemesterExists) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'This academic semester not found!',
    );
  }

  const isSemesterRegistrationExists = await SemesterRegistration.findOne({
    academicSemester,
  });

  if (isSemesterRegistrationExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'This semester already exists!');
  }

  const result = await SemesterRegistration.create(payload);
  return result;
};

const getAllSemesterRegistrationFromDb = async (
  query: Record<string, unknown>,
) => {
  const semesterRegistrationQuery = new QueryBuilder(
    SemesterRegistration.find(query).populate('academicSemester'),
    query,
  )
    .filter()
    .sort()
    .fields();

  const result = await semesterRegistrationQuery.modelQuery;
  return result;
};
const getSingleSemesterRegistrationFromDb = async (id: string) => {
  const result =
    await SemesterRegistration.findById(id).populate('academicSemester');

  return result;
};

const deleteSemesterRegistrationFromDb = async (id: string) => {
  const session = await startSession();
  try {
    session.startTransaction();

    const isSemesterRegistrationExist = await SemesterRegistration.findById(id);

    if (!isSemesterRegistrationExist) {
      throw new AppError(
        httpStatus.NOT_FOUND,
        'this semester registration is not found!',
      );
    }

    // check semester registration status is upcoming

    const semesterRegistrationStatus = isSemesterRegistrationExist?.status;

    if (semesterRegistrationStatus !== 'UPCOMING') {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        `You can not delete semester registration in status : ${semesterRegistrationStatus}`,
      );
    }

    await OfferedCourse.deleteMany({
      semesterRegistration: id,
    }).session(session);

    const result =
      await SemesterRegistration.findByIdAndDelete(id).session(session);

    await session.commitTransaction();
    await session.endSession();

    return result;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw error;
  }
};

const updateSemesterRegistrationInoDB = async (
  id: string,
  payload: Partial<TSemesterRegistration>,
) => {
  const isSemesterRegistrationExists = await SemesterRegistration.findById(id);

  if (!isSemesterRegistrationExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'This semester is not found!');
  }

  const currentSemesterStatus = isSemesterRegistrationExists.status;
  const requestedStatus = payload?.status;

  if (currentSemesterStatus === RegistrationStatus.ENDED) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `This semester already ${currentSemesterStatus}`,
    );
  }

  if (
    currentSemesterStatus === RegistrationStatus.UPCOMING &&
    requestedStatus === RegistrationStatus.ENDED
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `You can not directly change ${currentSemesterStatus} to ${requestedStatus}`,
    );
  }

  if (
    currentSemesterStatus === RegistrationStatus.ONGOING &&
    requestedStatus === RegistrationStatus.UPCOMING
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `You can not directly change ${currentSemesterStatus} to ${requestedStatus}`,
    );
  }

  const result = await SemesterRegistration.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  return result;
};

export const SemesterRegistrationServices = {
  createSemesterRegistrationInoDB,
  getAllSemesterRegistrationFromDb,
  getSingleSemesterRegistrationFromDb,
  updateSemesterRegistrationInoDB,
  deleteSemesterRegistrationFromDb,
};
