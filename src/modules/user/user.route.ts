import express, { NextFunction, Request, Response } from 'express';
import { UserController } from './user.controller';
import { studentValidations } from '../student/student.validation';
import validateRequest from '../../middleware/validateRequest';
import { createFacultyValidationSchema } from '../Faculty/faculty.validation';
import { createAdminValidationSchema } from '../Admin/admin.validation';
import auth from '../../middleware/auth';
import { USER_ROLE } from './user.constant';
import { UserValidation } from './user.validation';
import { upload } from '../../utils/sendImageToCloudinary';

const router = express.Router();

router.post(
  '/create-student',
  auth(USER_ROLE.superAdmin,USER_ROLE.admin),
  upload.single('file'),
  (req : Request, res : Response, next : NextFunction)=>{
    req.body = JSON.parse(req.body.data);
    next()
  },
  validateRequest(studentValidations.createStudentValidationSchema),
  UserController.createStudent,
);

router.post(
  '/create-faculty',
  auth(USER_ROLE.superAdmin,USER_ROLE.admin),
  upload.single('file'),
  (req : Request, res : Response, next : NextFunction)=>{
    req.body = JSON.parse(req.body.data);
    next()
  },
  validateRequest(createFacultyValidationSchema),
  UserController.createFaculty,
);

router.post(
  '/create-admin',
  auth(USER_ROLE.superAdmin,USER_ROLE.admin),
  upload.single('file'),
  (req : Request, res : Response, next : NextFunction)=>{
    req.body = JSON.parse(req.body.data);
    next()
  },
  validateRequest(createAdminValidationSchema),
  UserController.createAdmin,
);

router.post(
  '/change-status/:id',
  auth(USER_ROLE.superAdmin,USER_ROLE.admin),
  validateRequest(UserValidation.changeStatusValidationSchema),
  UserController.changeStatus,
);

router.get(
  '/me',
  auth('superAdmin','student', 'faculty', 'admin'),
  UserController.getMe,
);

export const UserRoutes = router;
