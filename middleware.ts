import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify, JWTPayload } from 'jose';

interface MyJWTPayload extends JWTPayload {
  id: string; // Replace with your actual payload fields
  [key: string]: any; // Optionally, allow additional dynamic properties
}
export default async function authMiddleware(request: NextRequest): Promise<NextResponse> {
  const token = request.headers.get('authorization')?.split('Bearer ')[1];

  if (!token) {
    return NextResponse.json(
      { success: false, message: 'No token provided' },
      { status: 401 }
    );
  }

  const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback_secret_key');

  try {
     // Verify the token
     const { payload } = await jwtVerify(token, secret);

     // Cast payload to your custom type
     const decodedPayload = payload as MyJWTPayload;


    console.log('Decoded Token:', typeof(payload));
     // Safely access `id`
    const userId = decodedPayload.id;
    console.log(userId)

    if (!userId) {
      throw new Error('User ID not found in token');
    }


    // Add `userId` to response headers
    const response = NextResponse.next();
    response.headers.set('x-user-id', userId);
    
    return response;
  } catch (error: unknown) {
    console.error('JWT Error:', error);

    const message =
      error instanceof Error && error.name === 'JWTExpired'
        ? 'Token has expired'
        : 'Invalid token';

    return NextResponse.json(
      { success: false, message },
      { status: 403 }
    );
  }
}

// Configure middleware matcher and runtime
export const config = {
  matcher: ['/api/user/data/checkToken','/api/user/data'],
  runtime: 'experimental-edge', // Use Edge runtime
};
