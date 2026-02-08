// route.ts
import connectMongodb from "@/Database/connection";
import checkUserRole from "@/helpers/helpers";
import applicationsModel from "@/models/applications";
import usersModel from "@/models/users";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

connectMongodb().catch((err) => console.log("Database connection error:", err));

export async function GET(request: NextRequest) {
  try {
   
    const user_Data = await usersModel.find().select('_id name');
    console.log(user_Data);
    return NextResponse.json({
      success: true,
      user_Data: user_Data
    });
  } catch (error) {
    console.error("Error fetching applications:", error);
    return NextResponse.json({
      success: false,
      message: "Failed to fetch applications"
    }, { status: 500 });
  }
}