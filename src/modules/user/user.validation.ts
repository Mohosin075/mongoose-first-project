import { z } from 'zod';
import { USER_STATUS } from './user.constant';

const userValidationSchema = z.object({
  password: z
    .string({
      invalid_type_error: 'Password must be a string',
    })
    .nonempty({ message: 'Password is required' })
    .max(20, { message: "password can't more then 20 characters!" })
    .optional(),
  role: z.enum(['student', 'faculty', 'admin']),
});

const changeStatusValidationSchema = z.object({
  body : z.object({
    status : z.enum([...USER_STATUS] as [string, ...string[]] )
  })
})

export const UserValidation = {
  userValidationSchema,
  changeStatusValidationSchema
};
