
import express from 'express';
import validateRequest from '../../middleware/validateRequest';
import { AcademicDepartmentValidations } from './academicDepartment.validation';
import { AcademicDepartmentControllers } from './academicDepartment.controller';

const router = express.Router();

router.post('/create-academic-department', 
  // validateRequest(AcademicDepartmentValidations.createAcademicDepartmentValidationSchema),
  AcademicDepartmentControllers.createAcademicDepartment)


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