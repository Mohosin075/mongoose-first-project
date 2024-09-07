

import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import { AcademicDepartmentServices } from "./academicDepartment.services";

const createAcademicDepartment = catchAsync(async (req, res, next ) => {

const result = await AcademicDepartmentServices.createAcademicDepartmentIntoDB(req.body)

  sendResponse(res, {
    statusCode : httpStatus.OK,
    success : true,
    message : "Academic Department is created successfully.",
    data : result
  })
});


const getAllAcademicFaculties = catchAsync(async (req, res) => {
  const result = await AcademicDepartmentServices.getAllAcademicDepartmentFromDB();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic faculties are retrieved successfully',
    data: result,
  });
});

const getSingleAcademicDepartment = catchAsync(async (req, res) => {
  const { departmentId } = req.params;
  const result =
    await AcademicDepartmentServices.getSingleAcademicDepartmentFromDB(departmentId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic Department is retrieved successfully',
    data: result,
  });
});

const updateAcademicDepartment = catchAsync(async (req, res) => {
  const { departmentId } = req.params;
  const result = await AcademicDepartmentServices.updateAcademicDepartmentIntoDB(
    departmentId,
    req.body,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic Department is updated successfully',
    data: result,
  });
});

  export const AcademicDepartmentControllers = {
    createAcademicDepartment,
    getAllAcademicFaculties, 
    getSingleAcademicDepartment,
    updateAcademicDepartment 
  }