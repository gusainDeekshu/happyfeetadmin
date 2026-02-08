import connectMongodb from '@/Database/connection'
import usersModel from '@/models/users';
import { NextRequest, NextResponse } from 'next/server'
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

export async function GET(request: NextRequest) {
    connectMongodb();
  return NextResponse.json({ 
    message: 'Hello bhjvytug!' 
  })
}

export async function POST(request: NextRequest) {
    const body = await request.json()
    const { email, password } = body;
    await connectMongodb();
  console.log(process.env.JWT_SECRET);
  console.log(process.env.Salt);

  try {
    console.log("inside try block");
    const user = await usersModel.findOne({ email });
    if (!user) {
      // console.log("user not found");
      return NextResponse.json({ success: false, message: "User does not exist" });
    }
    const ismatch = await bcrypt.compare(
      password + process.env.Salt,
      user.password
    );

    if (!ismatch) {
      // console.log("user not matched");
      return NextResponse.json({
        success: false,
        message: "Invalid credentials password",
      });
    }
    console.log(user._id);

    const token=createtoken(user._id);
   return NextResponse.json({ success: true, token });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false, message: "error in login user" });
  }
  
 
}
export function createtoken(id: any){
    return jwt.sign({ id },process.env.JWT_SECRET);
  };
  