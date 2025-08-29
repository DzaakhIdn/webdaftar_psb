import { NextResponse } from "next/server";
import { cookies } from "next/headers";

// contoh: validasi token pakai JWT
import jwt from "jsonwebtoken";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
      email: string;
      nama_lengkap: string;
      status_pendaftaran: string;
      role: string;
    };

    // di sini bisa query database kalau mau data lengkap
    return NextResponse.json({
      id: decoded.id,
      email: decoded.email,
      nama_lengkap: decoded.nama_lengkap,
      status_pendaftaran: decoded.status_pendaftaran,
      role: decoded.role,
    });
  } catch (error) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}
