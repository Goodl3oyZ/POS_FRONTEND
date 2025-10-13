import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, password, fullName, role } = body;

    // Validate required fields
    if (!username || !password || !fullName || !role) {
      return NextResponse.json(
        { error: "กรุณากรอกข้อมูลให้ครบถ้วน" },
        { status: 400 }
      );
    }

    // Validate password length
    if (password.length < 6) {
      return NextResponse.json(
        { error: "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร" },
        { status: 400 }
      );
    }

    // Validate role
    if (!["admin", "staff"].includes(role)) {
      return NextResponse.json({ error: "ตำแหน่งไม่ถูกต้อง" }, { status: 400 });
    }

    // TODO: Implement your user registration logic here
    // For example, save user to database, check if username already exists, etc.

    // Mock registration for demonstration
    // In a real app, you would:
    // 1. Check if username already exists
    // 2. Hash the password
    // 3. Save user to database
    // 4. Send confirmation email (optional)

    console.log("New user registration:", {
      username,
      fullName,
      role,
      hashedPassword: "[HASHED]", // In real app, password should be hashed
    });

    // Mock success response
    return NextResponse.json(
      {
        message: "สมัครสมาชิกสำเร็จ",
        user: {
          id: Date.now().toString(), // Mock ID
          username,
          fullName,
          role,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการสมัครสมาชิก" },
      { status: 500 }
    );
  }
}
