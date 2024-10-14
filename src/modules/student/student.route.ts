import express from 'express';
import { StudentController } from './student.controller';
import validateRequest from '../../middleware/validateRequest';
import { studentValidations } from './student.validation';
import auth from '../../middleware/auth';

const router = express.Router();

router.get('/', 
  auth('admin', 'superAdmin'),
  StudentController.getAllStudents);

router.get('/:id', auth('faculty', 'admin', 'superAdmin'), StudentController.getSingleStudent);

router.patch(
  '/:id',
  auth('admin', 'superAdmin'),
  validateRequest(studentValidations.updateStudentValidationSchema),
  StudentController.updateStudent,
);

router.delete('/:id',
  auth('admin', 'superAdmin'),
  StudentController.deleteStudent);

export const StudentRoutes = router;
