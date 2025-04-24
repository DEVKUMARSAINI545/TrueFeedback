import dbConnect from "@/lib/dbConnect";
import UserModel, { Message } from "@/model/User.model";



export async function POST(request:Request)
{
    await dbConnect()

    const {username,content} =await  request.json()
    try {
        const user = await UserModel.findOne({username})
        if(!user)
        {
            return Response.json({success:false,message:"User not Found"},{status:401})
    
        }
        if(!user.isAcceptingMessage)
        {
            return Response.json({success:false,message:"User not accepting the messages"},{status:403})
     
        }
        const newMessage = {content,createAt:new Date()}
        user.messages.push(newMessage as Message)
        await user.save()
        return Response.json({success:true,message:"  messages send successfully"},{status:403})
     
    } catch (error) {
        console.log("Error while checking username is unique: ",error)
        return  Response.json({success:false,message:"Error while checking username is unique:"},{status:500})
   
    }


}