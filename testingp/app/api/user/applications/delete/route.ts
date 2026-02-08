import connectMongodb from "@/Database/connection";
import applicationsModel from "@/models/applications";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import fs from "fs/promises";
import path from "path";
import { useSearchParams } from "next/navigation";

// Ensure MongoDB is connected
connectMongodb().catch((err) => console.log("Database connection error:", err));

export async function DELETE(
  request: NextRequest, 
  { params }: { params: { appId: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const appId=searchParams.get('appId');
   

    // Find the application to get the image path
    const app = await applicationsModel.findById(appId);
    
    if (!app) {
      return NextResponse.json({ 
        success: false, 
        message: "Application not found" 
      }, { status: 404 });
    }

    // If there's an image, try to delete the file
    if (app.appImage) {
      const imagePath = path.join(process.cwd(), 'public', app.appImage.replace(/^\//, ''));
      try {
        await fs.unlink(imagePath);
      } catch (fileError) {
        console.error('Error deleting image file:', fileError);
        // Continue with deletion even if file delete fails
      }
    }

    // Delete the application from the database
    await applicationsModel.findByIdAndDelete(appId);

    return NextResponse.json({ 
      success: true, 
      message: "Application removed successfully" 
    });
  } catch (error) {
    console.error('Error deleting application:', error);
    return NextResponse.json({ 
      success: false, 
      message: "Error removing application" 
    }, { status: 500 });
  }
}