import { Router } from 'express';
import validateRequest from '../../middleware/validateRequest';
import { SemesterRegistrationValidations } from './semesterRegistration.validation';
import { SemesterRegistrationController } from './semesterRegistration.controller';
import auth from '../../middleware/auth';

const router = Router();

router.post(
  '/create-semester-registration',
  auth('superAdmin', 'admin'),
  validateRequest(
    SemesterRegistrationValidations.createSemesterRegistrationValidationSchema,
  ),
  SemesterRegistrationController.createSemesterRegistration,
);

router.patch(
  '/:id',
  auth('superAdmin', 'admin'),
  validateRequest(
    SemesterRegistrationValidations.updateSemesterRegistrationValidationSchema,
  ),
  SemesterRegistrationController.updateSemesterRegistration,
);

router.get(
  '/:id',
  auth('superAdmin', 'admin', 'faculty', 'student'),
  SemesterRegistrationController.getSingleSemesterRegistration,
);

router.delete(
  '/:id',
  auth('superAdmin', 'admin'),
  SemesterRegistrationController.deleteSemesterRegistration,
);

router.get(
  '/',
  auth('superAdmin', 'admin', 'faculty', 'student'),
  SemesterRegistrationController.getAllSemesterRegistration,
);

export const SemesterRegistrationRoute = router;
