import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import { SemesterRegistrationServices } from './semesterRegistration.service';

const createSemesterRegistration = catchAsync(
  async (req: Request, res: Response) => {
    const result = await SemesterRegistrationServices.createSemesterRegistrationInoDB(req.body)
    sendResponse(res, {
        success : true,
        statusCode : httpStatus.OK,
        message : 'Semester Registration created successfully!',
        data : result
    })
  },
);

const getAllSemesterRegistration = catchAsync(
  async (req: Request, res: Response) => {
    const result = await SemesterRegistrationServices.getAllSemesterRegistrationFromDb(req.query)
    sendResponse(res, {
        success : true,
        statusCode : 200,
        message : 'Semester Registration retrieved successfully!',
        data : result
    })
  },
);
const getSingleSemesterRegistration = catchAsync(
  async (req: Request, res: Response) => {
    const { id} = req.params
    const result = await SemesterRegistrationServices.getSingleSemesterRegistrationFromDb(id)
    sendResponse(res, {
        success : true,
        statusCode : httpStatus.OK,
        message : 'Semester Registration retrieved successfully!',
        data : result
    })
  },
);


const deleteSemesterRegistration = catchAsync(
  async (req: Request, res: Response) => {
    const { id} = req.params
    const result = await SemesterRegistrationServices.deleteSemesterRegistrationFromDb(id)
    sendResponse(res, {
        success : true,
        statusCode : httpStatus.OK,
        message : 'Semester Registration deleted successfully!',
        data : result
    })
  },
);

const updateSemesterRegistration = catchAsync(
  async (req: Request, res: Response) => {
    const {id} = req.params
    const result = await SemesterRegistrationServices.updateSemesterRegistrationInoDB(id, req.body)
    sendResponse(res, {
        success : true,
        statusCode : httpStatus.OK,
        message : 'Semester Registration updated successfully!',
        data : result
    })
  },
);

export const SemesterRegistrationController = {
  createSemesterRegistration,
  getAllSemesterRegistration,
  updateSemesterRegistration,
  getSingleSemesterRegistration,
  deleteSemesterRegistration
};
