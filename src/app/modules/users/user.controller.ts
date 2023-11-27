import { Request, Response } from "express";
import { UserServices } from "./user.service";

const createStudent = async (req: Request, res: Response) => {
    try {








        const { password, student: studentData } = req.body;
        //data validation using joi
        // const { error, value } = studentValidationSchema.validate(studentData);

        //data validation using zod
        // const zodParsedData = StudentValidationSchema.parse(studentData);


        const result = await UserServices.createStudnetIntoDB(password, studentData);

        // if (error) {
        //     res.status(500).json({
        //         success: false,
        //         message: "Something went wrong",
        //         error: error.details,
        //     })
        // }

        //will call service func to send this data 


        //send response
        res.status(200).json({
            success: true,
            message: "Student is created sucessfully",
            data: result,
        })
    }
    catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message || "Something went wrong",
            error: err,
        })
    }
}


export const UserControllers = {
    createStudent
}