import {getServerSession} from "next-auth"
import {AuthOptions} from "../auth/[...nextauth]/options"
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model"
import {User} from "next-auth"


export async function POST(request:Request)
{
    await dbConnect()
    const session = await getServerSession(AuthOptions)
    const user:User = session?.user as User
    if(!session)
    {
        return Response.json({success:false,message:"No Authenticated"},{status:401})
    }

   const UserId =  user?._id
   const {acceptMessage} = await request.json()
   try {
    const udpateUser = await UserModel.findByIdAndUpdate(UserId,{isAcceptingMessage:acceptMessage},{new:true})
    return Response.json({success:true,message:"Message Accepted status True"},{status:201})

   } catch (error) {
    console.log("Failed to Updated user status to accept messages")
    return Response.json({success:false,message:"Failed to update the user"},{status:400})
   }

}

export async function GET(requrest:Request)
{
    await dbConnect()
    const session = await getServerSession(AuthOptions)
    const user:User = session?.user as User
    if(!session)
    {
        return Response.json({success:false,message:"No Authenticated"},{status:401})
    }

   const UserId =  user?._id 
  try {
     const foundUser = await UserModel.findById(UserId)
     if(!foundUser)
     {    return Response.json({success:false,message:"No user found"},{status:401})
     }
     return Response.json({success:true,isAcceptingmessage:foundUser?.isAcceptingMessage},{status:201})
  } catch (error) {
    console.log("Failed to  found the user")
    return Response.json({success:false,message:" Failed to  found the user"},{status:400})
  }
}
