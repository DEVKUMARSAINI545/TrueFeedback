import {z} from "zod"

export const usernameValidation = z.string().min(2,"Username must be at least 2 characters").max(20,"Username must be at least 20 character").regex(/^[a-zA-Z0-9_]+$/,"Username must not contain special character")


export const SignUpSchema = z.object({
    username:usernameValidation,
    email:z.string().email({message:"Invalid email address"}),
    password:z.string().min(6,"Password must be 4 character ")
})

