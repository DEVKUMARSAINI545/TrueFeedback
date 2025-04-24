import dbConnect from "@/lib/dbConnect";
import UserModel, { User } from "@/model/User.model";
import { getServerSession } from "next-auth";
import { AuthOptions } from "../auth/[...nextauth]/options";
import mongoose from "mongoose";




export async function GET(request:Request)
{
    await dbConnect()
    const session = await getServerSession(AuthOptions)
    const user:User = session?.user as User
    if(!session)
    {
        return Response.json({success:false,message:"No Authenticated"},{status:401})
    }
    if (!user._id || typeof user._id !== 'string' || !mongoose.Types.ObjectId.isValid(user._id)) {
        return Response.json({ success: false, message: "Invalid user ID" }, { status: 400 });
      }
    
      const userId = new mongoose.Types.ObjectId(user._id);
       
      
      try {
        const user = await UserModel.aggregate([
            {
                $match:{_id:userId}
            },
            {$unwind:'$messages'},
            {$sort:{'messages.createAt':-1}},
            {$group:{_id:'$_id',messages:{$push:'$messages'}}}
        ])
        if(!user || user.length ==0)
        {
            return Response.json({success:false,message:"Messages not found"},{status:401})
    
        }
        return Response.json({success:true,messages:user[0].messages},{status:200})
    
      } catch (error) {
        console.log("Error while Messages not found ",error)
        return  Response.json({success:false,message:"Error while checking Messages not found:"},{status:500})
    
      }
}