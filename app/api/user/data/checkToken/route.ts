import connectMongodb from '@/Database/connection'
import usersModel from '@/models/users';
import { NextApiRequest } from 'next';
import {  NextResponse } from 'next/server'


const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
connectMongodb().catch(err => console.log("error", err));

export async function GET(request: NextApiRequest) {
  const userId = request.headers['x-user-id'] as string;
  const user_data=await usersModel.findById(userId);
  return NextResponse.json({ success: true, message:"verified"});
}

