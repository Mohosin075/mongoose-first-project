import express from 'express';
import { AcademicSemesterControllers } from './academicSemester.controller';
import validateRequest from './../../middleware/validateRequest';
import { AcademicSemesterValidations } from './academicSemester.validation';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../user/user.constant';

const router = express.Router();

router.post(
  '/create-academic-semester',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  validateRequest(
    AcademicSemesterValidations.createAcademicSemesterValidationSchema,
  ),
  AcademicSemesterControllers.createAcademicSemester,
);

router.get(
  '/:semesterId',
  auth('admin', 'superAdmin', 'faculty', 'student'),
  AcademicSemesterControllers.getSingleAcademicSemester,
);

router.patch(
  '/:semesterId',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  validateRequest(
    AcademicSemesterValidations.updateAcademicSemesterValidationSchema,
  ),
  AcademicSemesterControllers.updateAcademicSemester,
);

router.get(
  '/',
  auth('admin', 'superAdmin', 'faculty', 'student'),
  AcademicSemesterControllers.getAllAcademicSemesters,
);

export const AcademicSemesterRoutes = router;
