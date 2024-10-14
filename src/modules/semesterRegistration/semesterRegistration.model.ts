import { model, Schema } from 'mongoose';
import { TSemesterRegistration } from './semesterRegistration.interface';
import { SemesterRegistrationStatus } from './semesterRegistration.constant';

const semesterRegistrationSchema = new Schema<TSemesterRegistration>({
  academicSemester: {
    type: Schema.Types.ObjectId,
    ref: 'AcademicSemester',
  },
  status: {
    type: String,
    enum: SemesterRegistrationStatus,
    default: 'UPCOMING',
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  minCredit: {
    type: Number,
    default: 3,
    min: 3,
  },
  maxCredit: {
    type: Number,
    max: 16,
  },
});

export const SemesterRegistration = model<TSemesterRegistration>(
  'SemesterRegistration',
  semesterRegistrationSchema,
);
