


import express from 'express';
import { AcademicFacultyValidations } from './AcademicFaculty.validation';
import { AcademicFacultyControllers } from './academicFaculty.controller';
import validateRequest from '../../middleware/validateRequest';

const router = express.Router();

router.post('/create-academic-semester', validateRequest(AcademicFacultyValidations.createAcademicFacultyValidationSchema),AcademicFacultyControllers.createAcademicFaculty)


router.get(
    '/:facultyId',
    AcademicFacultyControllers.getSingleAcademicFaculty,
  );
  
  router.patch(
    '/:facultyId',
    validateRequest(
      AcademicFacultyValidations.updateAcademicFacultyValidationSchema,
    ),
    AcademicFacultyControllers.updateAcademicFaculty,
  );
  
  router.get('/', AcademicFacultyControllers.getAllAcademicFaculties);

export const AcademicFaultyRoutes = router; 