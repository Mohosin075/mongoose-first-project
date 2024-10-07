import { Schema, model, connect } from 'mongoose';
import validator from 'validator';
import {
  StudentModel,
  TGuardian,
  TLocalGuardian,
  TStudent,
  TUserName,
} from './student.interface';

const userNameSchema = new Schema<TUserName>({
  firstName: {
    type: String,
    trim: true,
    required: [true, 'First name is required'],
    maxlength: [20, 'First name can not be more then 20'],
    validate: {
      validator: function (value: string) {
        console.log('check error', value);
        const firstNameStr = value.charAt(0).toUpperCase() + value.slice(1);
        console.log(firstNameStr);
        return firstNameStr === value;
      },
      message: '{VALUE} is not capitalized format',
    },
  },
  middleName: {
    type: String,
    trim: true,
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    validate: {
      validator: (value: string) => validator.isAlpha(value),
      message: '{VALUE} is not valid',
    },
  },
});

const guardianSchema = new Schema<TGuardian>({
  fatherName: {
    type: String,
    required: [true, "Father's name is required"],
    trim: true,
  },
  fatherOccupation: {
    type: String,
    required: [true, "Father's occupation is required"],
    trim: true,
  },
  fatherContact: {
    type: String,
    required: [true, "Father's contact number is required"],
    trim: true,
  },
  motherName: {
    type: String,
    required: [true, "Mother's name is required"],
    trim: true,
  },
  motherOccupation: {
    type: String,
    required: [true, "Mother's occupation is required"],
    trim: true,
  },
  motherContact: {
    type: String,
    required: [true, "Mother's contact number is required"],
    trim: true,
  },
});

const localGuardianSchema = new Schema<TLocalGuardian>({
  name: {
    type: String,
    required: [true, "Local guardian's name is required"],
    trim: true,
  },
  occupation: {
    type: String,
    required: [true, "Local guardian's occupation is required"],
    trim: true,
  },
  contact: {
    type: String,
    required: [true, "Local guardian's contact number is required"],
    trim: true,
  },
  address: {
    type: String,
    required: [true, "Local guardian's address is required"],
    trim: true,
  },
});

const studentSchema = new Schema<TStudent, StudentModel>(
  {
    id: {
      type: String,
      required: [true, 'Student ID is required'],
      trim: true,
      unique: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      required: [true, 'user is required'],
      unique: true,
      ref: 'User',
    },
    name: {
      type: userNameSchema,
      required: [true, 'Student name is required'],
      trim: true,
    },
    gender: {
      type: String,
      trim: true,
      enum: {
        values: ['female', 'male', 'other'],
        message: '{VALUE} is not a valid gender',
      },
      required: [true, 'Gender is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      unique: true,
      validate: {
        validator: (value) => validator.isEmail(value),
        message: '{VALUE} is not a valid email type',
      },
    },
    dateOfBirth: {
      type: Date,
      trim: true,
    },
    contactNo: {
      type: String,
      required: [true, 'Contact number is required'],
      trim: true,
    },
    emergencyContactNo: {
      type: String,
      required: [true, 'Emergency contact number is required'],
      trim: true,
    },
    bloodGroup: {
      type: String,
      trim: true,
      enum: {
        values: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
        message: '{VALUE} is not a valid blood group',
      },
    },
    presentAddress: {
      type: String,
      required: [true, 'Present address is required'],
      trim: true,
    },
    permanentAddress: {
      type: String,
      required: [true, 'Permanent address is required'],
      trim: true,
    },
    guardian: {
      type: guardianSchema,
      required: [true, 'Guardian details are required'],
      trim: true,
    },
    localGuardian: {
      type: localGuardianSchema,
      required: [true, 'Local guardian details are required'],
      trim: true,
    },
    profileImg: {
      type: String,
      trim: true,
    },
    academicSemester: {
      type: Schema.Types.ObjectId,
      ref: 'AcademicSemester',
    },
    isDeleted: {
      type: Boolean,
    },
    academicDepartment: {
      type: Schema.Types.ObjectId,
      ref: 'AcademicDepartment',
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
  },
);

// virtual

studentSchema.virtual('fullName').get(function () {
  return `${this?.name?.firstName} ${this?.name?.middleName} ${this?.name?.lastName}`;
});

// query middleware
studentSchema.pre('find', function (next) {
  // console.log(this);

  this.find({ isDeleted: { $ne: true } });

  next();
});

studentSchema.pre('findOne', function (next) {
  // console.log(this);

  this.find({ isDeleted: { $ne: true } });

  next();
});

studentSchema.pre('aggregate', function (next) {
  // console.log(this);

  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });

  next();
});

// creating a custom static method

studentSchema.statics.isUserExists = async function (id: string) {
  const existingUser = await Student.findOne({ id });

  console.log(existingUser);
  return existingUser;
};

export const Student = model<TStudent, StudentModel>('Student', studentSchema);
