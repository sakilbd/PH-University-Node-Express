import config from "../../config";
import { Student } from "../student.model";
import { TStudent } from "../student/student.interface";
import { NewUser, TUser } from "./user.interface";
import { User } from "./user.model";

const createStudnetIntoDB = async (password: string, studentData: TStudent) => {
    //create a user object 
    // const user: NewUser = {}
    const userData: Partial<TUser> = {} //reuse TUser like NewUser
    //if password is not given,use default password

    userData.password = password || (config.default_password as string);
    //set studnet role;
    userData.role = 'student'

    //set manually generated Id 
    userData.id = "2030100001"

    //create a user
    const newUser = await User.create(userData); //built in 

    //create a student
    if (Object.keys(newUser).length) {
        //set id ,_id as user
        studentData.id = newUser.id;
        studentData.user = newUser._id; //referance id 
        const newStudnet = await Student.create(studentData)
        return newStudnet;
    }

}

export const UserServices = {
    createStudnetIntoDB,
}