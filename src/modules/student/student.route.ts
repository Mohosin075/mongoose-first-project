import express from 'express';
import { StudentController } from './student.controller';
import validateRequest from '../../middleware/validateRequest';
import { studentValidations } from './student.validation';
import auth from '../../middleware/auth';

const router = express.Router();

router.get('/', StudentController.getAllStudents);

router.get('/:id', auth('faculty', 'admin'), StudentController.getSingleStudent);

router.patch(
  '/:id',
  validateRequest(studentValidations.updateStudentValidationSchema),
  StudentController.updateStudent,
);

router.delete('/:id', StudentController.deleteStudent);

export const StudentRoutes = router;
