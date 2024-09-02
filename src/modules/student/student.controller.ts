import { RequestHandler } from 'express';
import { StudentServices } from './student.services';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';


const getSingleStudent = catchAsync(async (req, res) => {

    const { studentId } = req.params;
    const result = await StudentServices.getSingleStudentFromDB(studentId);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Single student data get successfully',
      data: result,
    });
});

const getAllStudents: RequestHandler = catchAsync(async (req, res) => {

  const result = await StudentServices.getAllStudentsFromDB();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student data get successfully',
    data: result,
  });
});



const deleteStudent = catchAsync(async (req, res, next) => {

  const { studentId } = req.params;

  const result = await StudentServices.deleteStudentFromDB(studentId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'student delete successfully',
    data: result,
  });

});

export const StudentController = {
  getAllStudents,
  getSingleStudent,
  deleteStudent,
};
