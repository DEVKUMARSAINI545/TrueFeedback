import { getServerSession } from "next-auth";
import { AuthOptions } from "../../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import { User } from "next-auth";

export async function DELETE(
  request: Request,
  context: { params: { messageid: string } }
) {
  const { messageid } = context.params;

  await dbConnect();
  const session = await getServerSession(AuthOptions);
  const user: User = session?.user as User;

  if (!session) {
    return Response.json(
      { success: false, message: "Not Authenticated" },
      { status: 401 }
    );
  }

  try {
    const updatedResult = await UserModel.updateOne(
      { _id: user._id },
      { $pull: { messages: { _id: messageid } } }
    );

    if (updatedResult.modifiedCount === 0) {
      return Response.json(
        { success: false, message: "Message not found or already deleted" },
        { status: 400 }
      );
    }

    return Response.json(
      { success: true, message: "Message deleted" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error while deleting message:", error);
    return Response.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
