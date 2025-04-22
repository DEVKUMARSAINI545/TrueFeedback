import { usernameValidation } from "@/Schema/SignUp.Schema";
import {z} from "zod"
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
const UsernameQuerySchema = z.object({
    username:usernameValidation
})

export async function GET(req:Request)
{
   await dbConnect()
    try {
        const {searchParams} =new URL(req.url) 
        const queryParam={
            username:searchParams.get("username")
        }
       const result =  UsernameQuerySchema.safeParse(queryParam)
       console.log(result);
       if(!result.success)
       {
        const usernameError =   result.error.format().username?._errors || []
        return Response.json({
            success:false,message:usernameError?.length > 0 ? usernameError.join(',') : "Invalid query Paramters"
        },{status:400})
       }
       const {username} = result.data

       const existingUsername = await UserModel.findOne({username,isVerified:true})
       if(existingUsername)
       {
        return Response.json({
            success:false,message:"Username is already taken",
        },{status:400})
       }else{
        return Response.json({
            success:true,message:"Username is unqiue",
        },{status:201})
       }


    } catch (error) {
        console.log("Error while checking username is unique: ",error)
        return  Response.json({success:false,message:"Error while checking username is unique:"},{status:500})
    }


}



