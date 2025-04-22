
import  VerificationEmail  from "@/email/VerificationEmail";
import { ApiResponse } from "../types/ApiResponse";
import { resend } from "./VerifyEmailAPI";



export async function SendVerificationEmail(
    email:string,
    username:string,
    verifyCode:string,
):Promise<ApiResponse> {
    try {
        await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: email,
            subject: 'Mystry Message | Verification code',
            react: VerificationEmail({username,otp:verifyCode})
          });
        return {success:true,message:"Verification Email send Successfully."}
    } catch (errorEmail) {
        console.log("Error sending verification Email",errorEmail)
        return {success:false,message:"Failed to send Verification Email"}
    }
    
}