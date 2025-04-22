import {z} from "zod"

export const MessageSchema = z.object({
     content:z.string().min(10,{message:"Content must be only in 10 character"}).max(300,{message:"Content must be only in 300 character"})
   
})