import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, code } = await request.json();
    const user = await UserModel.findOne({ username, verifyCode: code });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Username does not exist" },
        { status: 400 }
      );
    }

    const isCodeRight = user.verifyCode === code;
    const isCodeNotExpired = new Date(user.verifyCodeExpire) > new Date(); // assuming expiry is stored in a separate field like `verifyCodeExpiry`

    if (isCodeRight && isCodeNotExpired) {
      user.isVerified = true;
      await user.save();
      return NextResponse.json(
        { success: true, message: "Account verified successfully" },
        { status: 201 }
      );
    } else if (!isCodeNotExpired) {
      return NextResponse.json(
        {
          success: false,
          message: "Verification code has expired. Please sign up again.",
        },
        { status: 400 }
      );
    } else {
      return NextResponse.json(
        { success: false, message: "Verification code is incorrect." },
        { status: 400 }
      );
    }
  } catch (error) {
    console.log("Error while verifying the code:", error);
    return NextResponse.json(
      { success: false, message: "Error while verifying the code." },
      { status: 500 }
    );
  }
}
