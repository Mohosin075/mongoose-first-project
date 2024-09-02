import config from "../../app/config";
import { TStudent } from "../student/student.interface";
import { TNewUser } from "./user.interface";
import { User } from "./user.model";
import { Student } from './../student/student.model';


const createStudentIntoDB = async(password : string ,studentData : TStudent)=>{

//    create a new user

    const user : TNewUser = {};

    // default pass set

    user.password = password || (config.default_pass as string)

    // set user role
    user.role = 'student'

    // set manual id

    user.id = '2030010001'

    const newUser = await User.create(user); 


    if(Object.keys(newUser).length){
        console.log(studentData);
        studentData.id = newUser.id,
        studentData.user = newUser._id
        
        const newStudent = await Student.create(studentData)


        return newStudent

    }


    // return newUser    
}


export const UserServices = {
    createStudentIntoDB
}