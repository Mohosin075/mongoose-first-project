import express from 'express';
import validateRequest from '../../middleware/validateRequest';
import { AcademicDepartmentValidations } from './academicDepartment.validation';
import { AcademicDepartmentControllers } from './academicDepartment.controller';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../user/user.constant';

const router = express.Router();

router.post(
  '/create-academic-department',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  validateRequest(AcademicDepartmentValidations.createAcademicDepartmentValidationSchema),
  AcademicDepartmentControllers.createAcademicDepartment,
);

router.get(
  '/:departmentId',
  AcademicDepartmentControllers.getSingleAcademicDepartment,
);

router.patch(
  '/:departmentId',
  validateRequest(
    AcademicDepartmentValidations.updateAcademicDepartmentValidationSchema,
  ),
  AcademicDepartmentControllers.updateAcademicDepartment,
);

router.get('/', AcademicDepartmentControllers.getAllAcademicFaculties);

export const AcademicDepartmentRoutes = router;
