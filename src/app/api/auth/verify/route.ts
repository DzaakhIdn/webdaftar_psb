import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const auth_token = {
  user: "auth_token",
  dashboard: "token_dashboard",
};

const JWT_SECRET =
  process.env.JWT_SECRET;

export async function GET(req: Request) {
  try {
    const cookieHeader = req.headers.get("cookie");
    if (!cookieHeader) {
      return NextResponse.json({ message: "No token found" }, { status: 401 });
    }

    // Try to find either auth_token or token_dashboard
    const token = cookieHeader
      .split(";")
      .find(
        (c) =>
          c.trim().startsWith(`${auth_token.user}=`) ||
          c.trim().startsWith(`${auth_token.dashboard}=`)
      )
      ?.split("=")[1];

    if (!token) {
      return NextResponse.json({ message: "Token missing" }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: string;
      email: string;
      role: string;
    };

    return NextResponse.json(
      {
        user: {
          id: decoded.id,
          email: decoded.email,
          role: decoded.role,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Verify error:", error);
    return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  }
}
