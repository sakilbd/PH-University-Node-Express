import { NextFunction, Request, Response } from "express";
import { UserServices } from "./user.service";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";

const createStudent = async (req: Request, res: Response, next: NextFunction) => {
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
        // res.status(200).json({
        //     success: true,
        //     message: "Student is created sucessfully",
        //     data: result,
        // })

        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "Student is created sucessfully",
            data: result,
        });
    }
    catch (err) {
        next(err);
    }
}


export const UserControllers = {
    createStudent
}