import { Schema, model } from 'mongoose';
import validator from 'validator';
import {
    TGuardian,
    TLocalGuardian,
    TStudent,
    StudentMethods,
    StudentModel,
    TUserName,
} from './student/student.interface';

import bycrypt from 'bcrypt';
import config from '../config';

const userNameSchema = new Schema<TUserName>({
    firstName: {
        type: String,
        trim: true, //removes heading and trailing spaces.
        required: [true, "First Name is Required"], //custom error message syntax
        maxlength: [20, "FirstName Cannot be more than 20 characters"],
        validate: {
            validator: function (value: string) {
                const firstNameStr = value.charAt(0).toUpperCase() + value.slice(1);
                return firstNameStr === value;
            },
            message: '{VALUE} is not in a capatilzie format',
        }

    },
    middleName: {
        type: String,
    },
    lastName: {
        type: String,
        required: [true, "Last Name is Required"], //custom error message syntax
        validate: {
            validator: (value: string) => validator.isAlpha(value),
            message: '{VALUE} is not valid'
        }
    },
});

const guardianSchema = new Schema<TGuardian>({
    fatherName: {
        type: String,
        required: true,
    },
    fatherOccupation: {
        type: String,
        required: true,
    },
    fatherContactNo: {
        type: String,
        required: true,
    },
    motherName: {
        type: String,
        required: true,
    },
    motherOccupation: {
        type: String,
        required: true,
    },
    motherContactNo: {
        type: String,
        required: true,
    },
});

const localGuradianSchema = new Schema<TLocalGuardian>({
    name: {
        type: String,
        required: true,
    },
    occupation: {
        type: String,
        required: true,
    },
    contactNo: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
});

// const studentSchema = new Schema<TStudent, StudentModel, StudentMethods>({ // for custom instance 
const studentSchema = new Schema<TStudent, StudentModel>({ //for static methods 

    id: { type: String, required: true, unique: true },
    password: {
        type: String, required: true, maxlength: [20, "Password cannot be more than 20 characters"]
    },

    name: {
        type: userNameSchema,
        required: true,
    },
    gender: {
        type: String,
        enum: {
            values: ['male', 'female', 'other'],
            message: '{VALUE} is not valid' //use given value
        },
        required: true
    },
    dateOfBirth: { type: String },
    email: {
        type: String, required: true, unique: true, validate: {
            validator: (value: string) => validator.isEmail(value),
            message: '{VALUE} is not email type'
        }
    },
    contactNo: { type: String, required: true },
    emergencyContactNo: { type: String, required: true },
    bloogGroup: {
        type: String,
        enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
    },
    presentAddress: { type: String, required: true },
    permanentAddres: { type: String, required: true },
    guardian: {
        type: guardianSchema,
        required: true,
    },
    localGuardian: {
        type: localGuradianSchema,
        required: true,
    },
    profileImg: { type: String },
    isActive: {
        type: String,
        enum: ['active', 'blocked'],
        default: 'active',
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
}, {
    toJSON: {
        virtuals: true,
    }
});
//virtual 

studentSchema.virtual("fullName").get(function () {
    return `${this.name.firstName} ${this.name.middleName} ${this.name.lastName}`;
})



//pre save middleware/hook will work on create() save()

studentSchema.pre("save", async function (next) {
    // console.log(this, "pre hook :we will save the data")
    //hashing password and save into db 
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const user = this;//refers to doc 
    user.password = await bycrypt.hash(user.password, Number(config.bcrypt_salt_rounds))
    next();
})

//post save middleware/hook 
studentSchema.post("save", function (doc, next) {
    // console.log(this, "post hook :we saved our data")
    doc.password = "";
    next();
})

//Query Middleware
studentSchema.pre("find", function (next) {
    this.find({ isDeleted: { $ne: true } });
    next();
})
studentSchema.pre("findOne", function (next) {
    this.find({ isDeleted: { $ne: true } });
    next();
})

studentSchema.pre("aggregate", function (next) {
    // this.find({ isDeleted: { $ne: true } });
    this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } })
    next();
})





//creating a custom static method 

studentSchema.statics.isUserExists = async function (id: string) {
    const existingUser = await Student.findOne({ id })
    return existingUser;
}




//creating a custom instance method 
// studentSchema.methods.isUserExists = async function (id: string) {
//     const existingUser = await Student.findOne({ id })
//     return existingUser;
// }

export const Student = model<TStudent, StudentModel>('Student', studentSchema);