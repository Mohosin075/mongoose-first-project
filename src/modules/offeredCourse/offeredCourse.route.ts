import { Router } from 'express';
import validateRequest from '../../middleware/validateRequest';
import { OfferedCourseValidations } from './offeredCourse.validation';
import { OfferedCourseControllers } from './offeredCourse.controller';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../user/user.constant';

const router = Router();



router.post(
  '/create-offered-course',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  validateRequest(OfferedCourseValidations.createOfferedCourseSchemaValidation),
  OfferedCourseControllers.createOfferedCourse,
);



router.get(
  '/',
  auth('superAdmin', 'admin', 'faculty'),
  OfferedCourseControllers.getAllOfferedCourse,
);

// router.get(
//   '/my-offered-course',
//   auth(USER_ROLE.student),
//   OfferedCourseControllers.getMyOfferedCourse,
// );

router.get(
  '/:id',
  auth('superAdmin', 'admin', 'faculty', 'student'),
  OfferedCourseControllers.getSingleOfferedCourse,
);

router.delete(
  '/:id',
  auth('superAdmin', 'admin'),
  OfferedCourseControllers.deleteOfferedCourse,
);

router.patch(
  '/:id',
  auth('superAdmin', 'admin'),
  validateRequest(OfferedCourseValidations.updateOfferedCourseSchemaValidation),
  OfferedCourseControllers.updateSingleOfferedCourse,
);

export const OfferedCourseRoute = router;
