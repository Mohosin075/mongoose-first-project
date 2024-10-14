import { Model, Types } from 'mongoose';

export type TUserName = {
  firstName: string;
  middleName?: string;
  lastName: string;
};

export type TGuardian = {
  fatherName: string;
  fatherOccupation: string;
  fatherContact: string;
  motherName: string;
  motherOccupation: string;
  motherContact: string;
};

export type TLocalGuardian = {
  name: string;
  occupation: string;
  contact: string;
  address: string;
};

export type TStudent = {
  id: string;
  user: Types.ObjectId;
  name: TUserName;
  gender: 'male' | 'female' | 'other';
  dateOfBirth?: Date;
  email: string;
  contactNo: string;
  emergencyContactNo: string;
  bloodGroup?: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  presentAddress: string;
  permanentAddress: string;
  guardian: TGuardian;
  localGuardian: TLocalGuardian;
  profileImg?: string;
  academicSemester: Types.ObjectId;
  academicDepartment: Types.ObjectId;
  academicFaculty : Types.ObjectId;
  isDeleted: boolean;
};

// for creating statics

export interface StudentModel extends Model<TStudent> {
  isUserExists(id: string): Promise<TStudent | null>;
}

// for creating instance

// export type StudentMethod = {
//   isStudentExists (id : string) : Promise<TStudent | null>
// }

// export type StudentModel = Model<TStudent, {}, StudentMethod>;
