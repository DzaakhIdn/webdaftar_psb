import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const jwtSecret = process.env.JWT_SECRET!;

export async function GET(req: NextRequest) {
  try {
    // Get token from cookies
    const token = req.cookies.get("token_dashboard")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "No authentication token found" },
        { status: 401 }
      );
    }

    // Verify and decode JWT token
    const decoded = jwt.verify(token, jwtSecret) as {
      id: string;
      username: string;
      nama_lengkap: string;
      role: string;
      gender?: string;
      exp: number;
    };

    // Check if token is expired
    if (decoded.exp * 1000 < Date.now()) {
      return NextResponse.json({ error: "Token expired" }, { status: 401 });
    }

    // Return user info
    return NextResponse.json({
      success: true,
      user: {
        id: decoded.id,
        username: decoded.username,
        nama_lengkap: decoded.nama_lengkap,
        role: decoded.role,
        gender: decoded.gender,
      },
    });
  } catch (error) {
    console.error("Error in /api/dashboard/auth/me:", error);
    return NextResponse.json(
      { error: "Invalid or expired token" },
      { status: 401 }
    );
  }
}
