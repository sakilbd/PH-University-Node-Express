import { Schema, model } from "mongoose";
import { TUser } from "./user.interface";
import config from "../../config";
import bycrypt from 'bcrypt';

const userSchema = new Schema<TUser>({
    id: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    needsPasswordChange: {
        type: Boolean,
        default: true,
    },
    role: {
        type: String,
        enum: ['student', 'faculty', 'admin']
    },
    status: {
        type: String,
        enum: ['in-progress', 'blocked'],
        default: 'in-progress',
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
},
    {
        timestamps: true,

    })




userSchema.pre("save", async function (next) {
    // console.log(this, "pre hook :we will save the data")
    //hashing password and save into db 
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const user = this;//refers to doc 
    user.password = await bycrypt.hash(user.password, Number(config.bcrypt_salt_rounds))
    next();
})

//set empth sctring after password 
userSchema.post("save", function (doc, next) {
    // console.log(this, "post hook :we saved our data")
    doc.password = "";
    next();
})
export const User = model<TUser>("User", userSchema);