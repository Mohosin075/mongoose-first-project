import { z } from 'zod';
import { Days } from './offeredCourse.constant';

const timeStringSchema = z.string().refine(
    (time) => {
      const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
      return timeRegex.test(time);
    },
    {
      message: 'Invalid time format. Please use HH:MM (24-hour format).',
    },
  )


const createOfferedCourseSchemaValidation = z.object({
  body: z.object({
    semesterRegistration: z.string(),
    academicFaculty: z.string(),
    academicDepartment: z.string(),
    course: z.string(),
    faculty: z.string(),
    maxCapacity: z.number(),
    section: z.number(),
    days: z.array(z.enum([...(Days as [string, ...string[]])])),
    startTime: timeStringSchema,
    endTime: timeStringSchema,
  }).refine(body=>{
    const start = new Date(`2024-09-28T${body.startTime}:00`)
    const end = new Date(`2024-09-28T${body.endTime}:00`);
    return end > start
  },{
    message : 'Start Time should be before End Time!'
  }),
});

const updateOfferedCourseSchemaValidation = z.object({
  body: z.object({
    faculty: z.string(),
    maxCapacity: z.number(),
    section: z.number(),
    days: z.array(z.enum([...(Days as [string, ...string[]])])),
    startTime: timeStringSchema,
    endTime: timeStringSchema,
  }).refine(body=>{
    const start = new Date(`2024-09-28T${body.startTime}:00`)
    const end = new Date(`2024-09-28T${body.endTime}:00`);
    return end > start
  },{
    message : 'Start Time should be before End Time!'
  }),
});

export const OfferedCourseValidations = {
  createOfferedCourseSchemaValidation,
  updateOfferedCourseSchemaValidation,
};
