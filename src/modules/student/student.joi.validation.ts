import Joi from 'Joi';

const userNameValidationSchema = Joi.object({
    firstName: Joi.string()
      .trim()
      .required()
      .max(20)
      .custom((value, helpers) => {
        const firstNameStr = value.charAt(0).toUpperCase() + value.slice(1);
        if (firstNameStr !== value) {
          return helpers.error('any.invalid'); // Custom error type for capitalization
        }
        return value;
      }, 'Capitalization check'),
    middleName: Joi.string().trim(),
    lastName: Joi.string()
      .trim()
      .required()
      .regex(/^[a-zA-Z]+$/)
      .message('{#label} must contain only letters'), // Custom message for regex validation
  });

  // Define the schema for Guardian
  const guardianValidationSchema = Joi.object({
    fatherName: Joi.string().trim().required(),
    fatherOccupation: Joi.string().trim().required(),
    fatherContact: Joi.string().trim().required(),
    motherName: Joi.string().trim().required(),
    motherOccupation: Joi.string().trim().required(),
    motherContact: Joi.string().trim().required(),
  });

  // Define the schema for LocalGuardian
  const localGuardianValidationSchema = Joi.object({
    name: Joi.string().trim().required(),
    occupation: Joi.string().trim().required(),
    contact: Joi.string().trim().required(),
    address: Joi.string().trim().required(),
  });

  // Define the schema for Student
  const studentValidationSchema = Joi.object({
    id: Joi.string().trim().required(),
    name: userNameValidationSchema.required(),
    gender: Joi.string().trim().valid('female', 'male', 'other').required(),
    email: Joi.string().trim().email().required(),
    dateOfBirth: Joi.string().trim(),
    contactNo: Joi.string().trim().required(),
    emergencyContactNo: Joi.string().trim().required(),
    bloodGroup: Joi.string()
      .trim()
      .valid('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'),
    presentAddress: Joi.string().trim().required(),
    permanentAddress: Joi.string().trim().required(),
    guardian: guardianValidationSchema.required(),
    localGuardian: localGuardianValidationSchema.required(),
    profileImg: Joi.string().trim(),
    isActive: Joi.string()
      .trim()
      .valid('active', 'inactive')
      .default('active'),
  });

  export default studentValidationSchema