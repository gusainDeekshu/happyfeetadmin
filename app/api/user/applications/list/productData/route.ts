// route.ts
import connectMongodb from "@/Database/connection";
import applicationsModel from "@/models/applications";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

connectMongodb().catch((err) => console.log("Database connection error:", err));

export async function GET(request: NextRequest) {
  try {    
    let application_Data;
    const url = new URL(request.url);

    // Extract query parameters
    const page = parseInt(url.searchParams.get("page") || "1"); // Default to page 1
    const limit = parseInt(url.searchParams.get("limit") || "10"); // Default to 10 items per page
    const skip = (page - 1) * limit; // Calculate documents to skip
console.log(page + "=Page");
    application_Data = await applicationsModel.find().sort({ createdAt: -1 })// Sort by most recent
    .skip(skip)               // Skip documents
    .limit(limit);            // Limit number of documents
    // Find applications for the specific user
const total = await applicationsModel.countDocuments();
    return NextResponse.json({
      success: true,
      application_Data: application_Data,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalBlogs: total,
    });
  } catch (error) {
    console.error("Error fetching applications:", error);
    return NextResponse.json({
      success: false,
      message: "Failed to fetch applications"
    }, { status: 500 });
  }
}
export async function POST(request: NextRequest) {
  try {    
    const body = await request.json();
    const { id } = body;
    if (!id) {
      return NextResponse.json(
        { success: false, message: "ID is required" },
        { status: 400 }
      );
    }
    let application_Data;
    application_Data = await applicationsModel.findById(id);
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