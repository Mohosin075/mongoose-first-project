
import { z } from 'zod';

const userValidationSchema = z.object({
  password: z.string({
    invalid_type_error : "Password must be a string"
  }).nonempty({ message: 'Password is required' }).max(20, {message : "password can't more then 20 characters!"}).optional(),
  role: z.enum(['student', 'faculty', 'admin']),
});


export const UserValidation = {
    userValidationSchema
}
