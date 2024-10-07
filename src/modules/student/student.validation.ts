import { z } from 'zod';

const userNameValidationSchema = z.object({
  firstName: z
    .string()
    .trim()
    .max(20, 'First name cannot be more than 20 characters')
    .refine((value) => value.charAt(0) === value.charAt(0).toUpperCase(), {
      message: 'First name must start with a capital letter',
    }),
  middleName: z.string().trim().optional(),
  lastName: z
    .string()
    .trim()
    .nonempty('Last name is required')
    .refine((value) => /^[A-Za-z]+$/.test(value), {
      message: 'Last name must contain only letters',
    }),
});

const guardianValidationSchema = z.object({
  fatherName: z.string().trim().nonempty("Father's name is required"),
  fatherOccupation: z
    .string()
    .trim()
    .nonempty("Father's occupation is required"),
  fatherContact: z
    .string()
    .trim()
    .nonempty("Father's contact number is required"),
  motherName: z.string().trim().nonempty("Mother's name is required"),
  motherOccupation: z
    .string()
    .trim()
    .nonempty("Mother's occupation is required"),
  motherContact: z
    .string()
    .trim()
    .nonempty("Mother's contact number is required"),
});

const localGuardianValidationSchema = z.object({
  name: z.string().trim().nonempty("Local guardian's name is required"),
  occupation: z
    .string()
    .trim()
    .nonempty("Local guardian's occupation is required"),
  contact: z
    .string()
    .trim()
    .nonempty("Local guardian's contact number is required"),
  address: z.string().trim().nonempty("Local guardian's address is required"),
});

const createStudentValidationSchema = z.object({
  body: z.object({
    password: z
      .string()
      .trim()
      .nonempty('Password is required')
      .max(20)
      .optional(),
    student: z.object({
      name: userNameValidationSchema,
      gender: z.enum(['female', 'male', 'other'], {
        errorMap: () => ({
          message:
            "Gender is required and must be one of 'female', 'male', or 'other'",
        }),
      }),
      email: z
        .string()
        .trim()
        .nonempty('Email is required')
        .email('Invalid email format'),
      dateOfBirth: z.string(),
      contactNo: z.string().trim().nonempty('Contact number is required'),
      emergencyContactNo: z
        .string()
        .trim()
        .nonempty('Emergency contact number is required'),
      bloodGroup: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], {
        errorMap: () => ({ message: 'Invalid blood group' }),
      }),
      presentAddress: z.string().trim().nonempty('Present address is required'),
      permanentAddress: z
        .string()
        .trim()
        .nonempty('Permanent address is required'),
      guardian: guardianValidationSchema,
      localGuardian: localGuardianValidationSchema,
      academicSemester: z.string(),
      profileImg: z.string(),
    }),
  }),
});

const updateUserNameValidationSchema = z.object({
  firstName: z.string().min(1).max(20).optional(),
  middleName: z.string().optional(),
  lastName: z.string().optional(),
});

const updateGuardianValidationSchema = z.object({
  fatherName: z.string().optional(),
  fatherOccupation: z.string().optional(),
  fatherContactNo: z.string().optional(),
  motherName: z.string().optional(),
  motherOccupation: z.string().optional(),
  motherContactNo: z.string().optional(),
});

const updateLocalGuardianValidationSchema = z.object({
  name: z.string().optional(),
  occupation: z.string().optional(),
  contactNo: z.string().optional(),
  address: z.string().optional(),
});

export const updateStudentValidationSchema = z.object({
  body: z.object({
    student: z.object({
      name: updateUserNameValidationSchema,
      gender: z.enum(['male', 'female', 'other']).optional(),
      dateOfBirth: z.string().optional(),
      email: z.string().email().optional(),
      contactNo: z.string().optional(),
      emergencyContactNo: z.string().optional(),
      bloodGroup: z
        .enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'])
        .optional(),
      presentAddress: z.string().optional(),
      permanentAddress: z.string().optional(),
      guardian: updateGuardianValidationSchema.optional(),
      localGuardian: updateLocalGuardianValidationSchema.optional(),
      admissionSemester: z.string().optional(),
      profileImg: z.string().optional(),
      academicDepartment: z.string().optional(),
    }),
  }),
});

export const studentValidations = {
  createStudentValidationSchema,
  updateStudentValidationSchema,
};
