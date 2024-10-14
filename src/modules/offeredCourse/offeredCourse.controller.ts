import { Request, Response } from 'express';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import { OfferedCourseServices } from './offeredCourse.service';

const createOfferedCourse = catchAsync(async (req: Request, res: Response) => {
  const result = await OfferedCourseServices.createOfferedCourseInoDB(req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Offered course retrieved successfully.',
    data: result,
  });
});

const getAllOfferedCourse = catchAsync(async (req: Request, res: Response) => {
  const result = await OfferedCourseServices.getAllOfferedCourseFromDb(req.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Offered course retrieved successfully.',
    data: result,
  });
});

// const getMyOfferedCourse = catchAsync(async (req: Request, res: Response) => {
//   const userId = req.user?.id
//   const result = await OfferedCourseServices.getMyOfferedCourseFromDb(userId);

//   console.log(userId);

//   sendResponse(res, {
//     success: true,
//     statusCode: httpStatus.OK,
//     message: 'Offered course retrieved successfully.',
//     data: result,
//   });
// });



const getSingleOfferedCourse = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await OfferedCourseServices.getSingleOfferedCourseInoDB(id);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Offered course retrieved successfully.',
      data: result,
    });
  },
);

const deleteOfferedCourse = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await OfferedCourseServices.deleteOfferedCourseInoDB(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Offered course deleted successfully.',
    data: result,
  });
});

const updateSingleOfferedCourse = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await OfferedCourseServices.updateOfferedCourseInoDB(
      id,
      req.body,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Offered course retrieved successfully.',
      data: result,
    });
  },
);

export const OfferedCourseControllers = {
  createOfferedCourse,
  getAllOfferedCourse,
  getSingleOfferedCourse,
  updateSingleOfferedCourse,
  deleteOfferedCourse,
  // getMyOfferedCourse
};
