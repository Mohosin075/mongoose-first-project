import { Request, Response } from 'express';
import { StudentServices } from './student.services';

const createStudent = async (req: Request, res: Response) => {
  try {
    const { student : studentData } = req.body;
    const result = await StudentServices.createStudentIntoDB(studentData);

    console.log(result);

    res.status(200).json({
      success: true,
      message: 'student is created successfully',
      data: result,
    });
  } catch (err) {
    console.log(err);
  }
};


const getAllStudents = async(req: Request, res : Response) =>{
  try{
    const result = await StudentServices.getAllStudentsFromDB();

    res.status(200).json({
      success : true,
      message : "Student are data get successfully",
      data : result
    })

  }catch(err){
    console.log(err);
  }
};

const getSingleStudent = async(req: Request, res : Response)=>{
  
  try{
    const {studentId} = req.params;

    const result = await StudentServices.getSingleStudentFromDB(studentId)

    res.status(200).json({
      success : true,
      message : "Single student data get successfully",
      data : result
    })

  }catch(err){
    console.log(err);
  }


}


export const StudentController = {
    createStudent,
    getAllStudents,
    getSingleStudent
}
