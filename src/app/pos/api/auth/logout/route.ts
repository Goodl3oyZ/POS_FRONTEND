import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  // Clear the auth token cookie
  const response = NextResponse.json({ success: true });
  response.cookies.delete("auth-token");

  return response;
}
