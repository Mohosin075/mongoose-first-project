import express from 'express';
import { FacultyControllers } from './faculty.controller';
import { updateFacultyValidationSchema } from './faculty.validation';
import validateRequest from '../../middleware/validateRequest';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../user/user.constant';

const router = express.Router();

router.get(
  '/:id',
  auth('superAdmin', 'admin', 'faculty'),
  FacultyControllers.getSingleFaculty,
);

router.patch(
  '/:id',
  auth('superAdmin', 'admin'),
  validateRequest(updateFacultyValidationSchema),
  FacultyControllers.updateFaculty,
);

router.delete(
  '/:id',
  auth('superAdmin', 'admin'),
  FacultyControllers.deleteFaculty,
);

router.get(
  '/',
  auth('superAdmin', 'admin', 'faculty'),
  auth(USER_ROLE.admin, USER_ROLE.faculty),
  FacultyControllers.getAllFaculties,
);

export const FacultyRoutes = router;
