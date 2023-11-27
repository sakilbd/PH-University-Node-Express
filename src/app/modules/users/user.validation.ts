import { z } from 'zod';

const userValidationSchema = z.object({
    // id: z.string(), // id should be auto incremental
    password: z.string({
        invalid_type_error: "Password must be a string",
    }).max(20, { message: 'Password can not be more than 20 characters' }).optional(),
    // needsPasswordChange: z.boolean().optional(),
    // role: z.enum(["admin", "student", 'faculty']),
    // status: z.enum(["in-progress", "blocked"]).default('in-progress'),
    // isDeleted: z.boolean().optional().default(false),

})


export const UserValidation = { userValidationSchema, }