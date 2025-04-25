import { getServerSession } from "next-auth";
import { AuthOptions } from "../../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import { NextRequest } from 'next/server';
import mongoose from 'mongoose';

export async function DELETE(request: NextRequest) {
  await dbConnect();
  
  const session = await getServerSession(AuthOptions);
  if (!session?.user) {
    return Response.json(
      { success: false, message: "Not authenticated" },
      { status: 401 }
    );
  }

  try {
    const { messageid } = await request.json();
    
    if (!messageid) {
      return Response.json(
        { success: false, message: "Message ID is required" },
        { status: 400 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(messageid)) {
      return Response.json(
        { success: false, message: "Invalid message ID format" },
        { status: 400 }
      );
    }

    const result = await UserModel.updateOne(
      { _id: session.user._id },
      { $pull: { messages: { _id: new mongoose.Types.ObjectId(messageid) } } }
    );

    if (result.modifiedCount === 0) {
      return Response.json(
        { success: false, message: "Message not found" },
        { status: 404 }
      );
    }

    return Response.json(
      { success: true, message: "Message deleted" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting message:", error);
    return Response.json(
      { success: false, message: "Error deleting message" },
      { status: 500 }
    );
  }
}