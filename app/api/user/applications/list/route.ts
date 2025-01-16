// route.ts
export const dynamic = "force-dynamic";
import connectMongodb from "@/Database/connection";
import checkUserRole from "@/helpers/helpers";
import applicationsModel from "@/models/applications";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

connectMongodb().catch((err) => console.log("Database connection error:", err));

export async function GET(request: NextRequest) {
  try {
    // Extract user ID from query parameters
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') ;
    const appId = searchParams.get('appId');


    // Add a null check for userId
    if (!userId) {
      return NextResponse.json({
        success: false,
        message: "User ID is required"
      }, { status: 400 });
    }

    let application_Data;

    const hasRole = await checkUserRole(userId, `admin`);
    
    if (hasRole) {
      if (appId) {
        console.log(appId +"mejhgytgttugyjgtyura");
        application_Data = await applicationsModel.findById(appId);
      } else {
        application_Data = await applicationsModel.find();
      }
    } else {
      if (appId) {
        application_Data = await applicationsModel.findById(appId);
      } else {
        application_Data = await applicationsModel.find({ user_id: userId });
      }
    }

    // Find applications for the specific user
    

    return NextResponse.json({
      success: true,
      application_Data: application_Data
    });
  } catch (error) {
    console.error("Error fetching applications:", error);
    return NextResponse.json({
      success: false,
      message: "Failed to fetch applications"
    }, { status: 500 });
  }
}