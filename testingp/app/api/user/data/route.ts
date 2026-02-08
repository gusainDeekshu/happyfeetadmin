import connectMongodb from '@/Database/connection'
import usersModel from '@/models/users';
import { NextRequest, NextResponse } from 'next/server'
import { createtoken } from '../login/route';



const bcrypt = require("bcrypt");

connectMongodb().catch(err => console.log("error", err));

export async function GET(request: NextRequest) {
  const user_id = request.headers.get('x-user-id');
  
  const user_data=await usersModel.findById(user_id);

  return NextResponse.json({ success: true, user_data:user_data});
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  
  const { name, password, email } = body;
    try {
     
      if (password.length < 8) {
        return NextResponse.json({
          success: false,
          message: "Please enter  a strong password",
        });
      }
         const customSalt = process.env.Salt;  // Your custom salt value
         const hashedpassword = await bcrypt.hash(password + customSalt,10);  
      console.log(hashedpassword);
      console.log(process.env.JWT_SECRET);
      const newuser = new usersModel({
        name: name,
        email: email,
        password: hashedpassword,
      });
      const user = await newuser.save();
      
      const token = createtoken(user._id);
      console.log("jwt success");

      return NextResponse.json({ success: true, token });
    } catch (error) {
      console.log(error);
      return NextResponse.json({ success: false, message:error });
    }
}
