import {getServerSession} from "next-auth"
import {AuthOptions} from "../../auth/[...nextauth]/options"
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model"
import {User} from "next-auth"


 
export async function DELETE(requrest:Request,{params}:{params:{messageId:string}})
{
 const messageId =  params.messageId
    await dbConnect()
    const session = await getServerSession(AuthOptions)
    const user:User = session?.user as User
    if(!session)
    {
        return Response.json({success:false,message:"No Authenticated"},{status:401})
    }

    try {
    const updatedResult = await UserModel.updateOne({_id:user._id},{$pull:{messages:{_id:messageId}}})
    if(updatedResult.modifiedCount == 0)
    {
        return Response.json({success:false,message:"Message not found already delete"},{status:400})
    }
    return Response.json({success:false,message:"Message  deleted"},{status:201})
    } catch (error) {
      console.log("Error while deleting messages: ",error)
      return  Response.json({success:false,message:"Error while deleting message:"},{status:500})
 
    }

 
}
