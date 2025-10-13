import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    // Get the token from cookies
    const token = req.cookies.get("auth-token");

    if (!token) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    // TODO: Verify token and get user data
    // This is where you would typically verify the JWT and fetch user data

    // Mock user data for demonstration
    return NextResponse.json({
      user: {
        id: "1",
        username: "admin",
        role: "admin",
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
