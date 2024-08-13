import { Schema, model, connect, Model } from 'mongoose';


export type TUserName = {
    firstName: string;
    middleName?: string;
    lastName: string;
  }

export type TGuardian = {
    fatherName: string;
    fatherOccupation: string;
    fatherContact: string;
    motherName: string;
    motherOccupation: string;
    motherContact: string;
  }

  export type TLocalGuardian = {
    name : string,
    occupation : string,
    contact : string,
    address : string,
  }

export type TStudent = {
  id: string;
  password : string;
  name: TUserName;
  gender: 'male' | 'female' | 'other';
  dateOfBirth?: string;
  email: string;
  contactNo: string;
  emergencyContactNo: string;
  bloodGroup?: 'A+'| 'A-'| 'B+'| 'B-'| 'AB+'| 'AB-'| 'O+'| 'O-';
  presentAddress: string;
  permanentAddress: string;
  guardian: TGuardian;
  localGuardian : TLocalGuardian,
  profileImg ?: string,
  isActive? : 'active' | 'inActive',
  isDeleted : boolean
};


// for creating statics

export interface StudentModel extends Model<TStudent> {
  isUserExists (id : string) : Promise<TStudent | null>
}


// for creating instance

// export type StudentMethod = { 
//   isStudentExists (id : string) : Promise<TStudent | null>
// }


// export type StudentModel = Model<TStudent, {}, StudentMethod>;
