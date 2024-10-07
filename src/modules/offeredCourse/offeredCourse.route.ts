import { Router } from 'express';
import validateRequest from '../../middleware/validateRequest';
import { OfferedCourseValidations } from './offeredCourse.validation';
import { CourseControllers } from '../course/course.controller';
import { OfferedCourseControllers } from './offeredCourse.controller';

const router = Router();

router.post(
  '/create-offered-course',
  validateRequest(OfferedCourseValidations.createOfferedCourseSchemaValidation),
  OfferedCourseControllers.createOfferedCourse,
);

router.get('/', OfferedCourseControllers.getAllOfferedCourse);

router.get('/:id', OfferedCourseControllers.getSingleOfferedCourse);
router.delete('/:id', OfferedCourseControllers.deleteOfferedCourse);

router.patch(
  '/:id',
  validateRequest(OfferedCourseValidations.updateOfferedCourseSchemaValidation),
  OfferedCourseControllers.updateSingleOfferedCourse,
);

export const OfferedCourseRoute = router;
