import bcrypt from "bcryptjs"
import dbConnect from "@/lib/dbConnect"
import UserModel from "@/model/User.model"
import { SendVerificationEmail } from "@/helpers/SendVerificationEmail"


export async function POST(request:Request)
{
    await dbConnect()
    try {
        const {username,email,password} =await request.json() 

         const exsitingUserVerifiedByUsername = await UserModel.findOne({username,isVerified:true})
         if(exsitingUserVerifiedByUsername)
         {
            return Response.json({success:false,message:"Username is already taken"},{status:400})
         }
         const exsitingUserVerifiedByEmail = await UserModel.findOne({email})
         const verifyCode = Math.floor(100000 + Math.random() * 90000).toString()
         if(exsitingUserVerifiedByEmail)
         {
            if(exsitingUserVerifiedByEmail.isVerified)
            {
               return Response.json({success:false,message:"User already exist with this email"},{status:400}) 
            }
            else{
                const hashPassword = await bcrypt.hash(password,10) 
                exsitingUserVerifiedByEmail.password = hashPassword
                exsitingUserVerifiedByEmail.verifyCode = verifyCode
                exsitingUserVerifiedByEmail.verifyCodeExpire = new Date(Date.now() + 3600000).toString()
                
                await exsitingUserVerifiedByEmail.save()
            }
         }else{
            const hashPassword =  await bcrypt.hash(password,10)
            const expiryDate = new Date()
            expiryDate.setHours(expiryDate.getHours() + 1)
           const newUser =  new UserModel({
                  username,
                   email,
                   password:hashPassword,
                   verifyCode,
                   verifyCodeExpire:expiryDate,
                   messages:[],
                   isVerified:false,
                   isAcceptingMessage:false
            })
            await newUser.save()
         }
        // send Verification Email
      const emailResponse =   await SendVerificationEmail(email,username,verifyCode)
      if(!emailResponse.success)
      {
        return Response.json({success:false,message:emailResponse.message},{status:500})
      }

      return   Response.json({success:true,message:"User register successfully? please Verify your email"},{status:201})
    } catch (error) {
        console.log("Error while registering error : ",error)
        return Response.json({success:false,message:"Error registering "},{status:500})           
    }
}