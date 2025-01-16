export const dynamic = "force-dynamic";
import connectMongodb from "@/Database/connection";
import applicationsModel from "@/models/applications";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import fs from "fs/promises";
import path from 'path';
const validator = require('validator');


// Ensure MongoDB is connected
connectMongodb().catch((err) => console.log("Database connection error:", err));

export const runtime = "nodejs"; // Specify the runtime if needed


type ValidationErrors = Record<string, string>;

type FormDataFields = {
  app_id?: string;
  user_id: string;
  appName: string;
  appDescription: string;
  appUrl: string;

  appDetails: string;
 
  image?: File;
};

// Convert errors to string
const errorsToString = (errors: ValidationErrors): string => {
  return Object.keys(errors)
    .map((key) => `${key}: ${errors[key]}`)
    .join(', ');
};

// Validate input
function validateInput(fields: FormDataFields): ValidationErrors {
  const errors: ValidationErrors = {};

  if (!fields.appName || validator.isEmpty(fields.appName)) {
    errors.appName = 'App Name is required.';
  }

  if (!fields.appDescription) {
    errors.appDescription = 'Description is required.';
  }

  

  if (!fields.appUrl || validator.isEmpty(fields.appUrl)) {
    errors.appUrl = 'URL is required.';
  }

  return errors;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    await fs.mkdir(uploadDir, { recursive: true });

    const app_Id = formData.get('app_id') as string | null;
    const user_id = formData.get('user_id') as string;
    const appName = formData.get('appName') as string;
    const appDescription = formData.get('appDescription') as string;
    const appUrl = formData.get('appUrl') as string;
  
    const appDetails = formData.get('appDetails') as string;
    
    const imageFile = formData.get('image') as File | null;
    const appImages = formData.getAll("appImages") as File[];

    const errors = validateInput({
      app_id: app_Id || undefined,
      user_id,
      appName,
      appDescription,
      appUrl,
     
      appDetails,
    
      image: imageFile || undefined,
     
    });

    if (Object.keys(errors).length > 0) {
      return NextResponse.json({
        success: false,
        message: errorsToString(errors),
      });
    }

    let appImage: string | null = null;
    if (imageFile && imageFile.size > 0) {
      const uniqueFilename = `${Date.now()}-${imageFile.name}`;
      const filePath = path.join(uploadDir, uniqueFilename);

      const bytes = await imageFile.arrayBuffer();
      await fs.writeFile(filePath, new Uint8Array(bytes));
      appImage = `/uploads/${uniqueFilename}`;
    }

    const savedFileNames: string[] = [];
    try {
      // Ensure the directory exists
      await fs.mkdir(uploadDir, { recursive: true });
    
      for (const file of appImages) {
        if (file.size > 0) {
          const uniqueFilename = `${Date.now()}-${file.name}`;
          const filePath = path.join(uploadDir, uniqueFilename);
    
          // Save file to the server
          const bytes = await file.arrayBuffer();
          await fs.writeFile(filePath, new Uint8Array(bytes));
    
          // Add the file path (relative to `public`) to the list
          savedFileNames.push(`/uploads/${uniqueFilename}`);
        }
      }
    } catch (error) {
      console.error("Error saving files:", error);
    }
    let file_names;
    if (savedFileNames.length > 0) {
          file_names=savedFileNames; // Save as JSON array
    }

    let Application;
    let message: string;

    if (app_Id) {
      const app = await applicationsModel.findById(app_Id);
      if (!app) {
        return NextResponse.json({
          success: false,
          message: "Application not found",
        }, { status: 404 });
      }

      if (app.appImage && appImage) {
        console.log("inside delete code ")
        const imagePath = path.join(process.cwd(), 'public', app.appImage.replace(/^\//, ''));
        try {
          await fs.unlink(imagePath);
        } catch (fileError) {
          console.error('Error deleting image file:', fileError);
        }
      }
      else
      {
        appImage=app.appImage;
      }

      
      if (app.displayImages && file_names) {
        // Loop through each element in app.displayImages and delete the files
        for (const element of app.displayImages) {
          const imagePath = path.join(process.cwd(), 'public', element.replace(/^\//, ''));
      
          try {
            await fs.unlink(imagePath); // Delete the image file
            console.log(`Deleted image: ${imagePath}`);
          } catch (fileError) {
            console.error('Error deleting image file:', fileError);
          }
        }
      }
      

      Application = await applicationsModel.findByIdAndUpdate(app_Id, {
        user_id,
        appName,
        appDescription,
        appUrl,
        appDetails,
        appImage,
        displayImages: file_names,
      });
      message = "Application updated successfully!";
    } else {
      Application = new applicationsModel({
        user_id,
        appName,
        appDescription,
        appUrl,
        appDetails,
        appImage,
        displayImages: file_names
      });
      message = "Application added successfully!";
    }

    const savedApplication = await Application.save();

    return NextResponse.json({
      success: true,
      message,
      application: savedApplication,
    });
  } catch (error) {
    console.error("Error during form processing:", error);
    return NextResponse.json({
      success: false,
      message: "Error occurred during application creation.",
      error: error instanceof Error ? error.message : String(error),
    }, { status: 500 });
  }
}
