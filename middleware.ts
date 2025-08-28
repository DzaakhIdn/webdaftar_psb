// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { paths } from "@/routes/paths";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  const clearTokenAndRedirect = (redirectUrl: string) => {
    const response = NextResponse.redirect(new URL(redirectUrl, req.url));
    response.cookies.set("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 0,
      path: "/",
    });
    return response;
  };

  if (!token) {
    // kalau user akses admin
    if (req.nextUrl.pathname.startsWith("/dashboard")) {
      return NextResponse.redirect(
        new URL(paths.authDashboard.signIn, req.url)
      );
    }

    // kalau user akses user
    if (req.nextUrl.pathname.startsWith("/user")) {
      return NextResponse.redirect(new URL(paths.authUser.signIn, req.url));
    }
  }

  try {
    const decoded = jwt.verify(token as string, process.env.JWT_SECRET!) as {
      role?: string;
      exp: number;
    };

    // Check if token is expired
    if (decoded.exp * 1000 < Date.now()) {
      if (req.nextUrl.pathname.startsWith("/dashboard")) {
        return clearTokenAndRedirect(paths.authDashboard.signIn);
      }
      if (req.nextUrl.pathname.startsWith("/user")) {
        return clearTokenAndRedirect(paths.authUser.signIn);
      }
    }

    // middleware khusus admin
    if (req.nextUrl.pathname.startsWith("/dashboard")) {
      // validasi role admin
      if (decoded.role !== "admin") {
        return clearTokenAndRedirect(paths.authDashboard.signIn);
      }
    }

    // middleware khusus user
    if (req.nextUrl.pathname.startsWith("/user")) {
      // validasi role user
      if (decoded.role !== "user") {
        return clearTokenAndRedirect(paths.authUser.signIn);
      }
    }

    return NextResponse.next();
  } catch {
    // kalau token invalid, clear token dan redirect
    if (req.nextUrl.pathname.startsWith("/dashboard")) {
      return clearTokenAndRedirect(paths.authDashboard.signIn);
    }
    if (req.nextUrl.pathname.startsWith("/user")) {
      return clearTokenAndRedirect(paths.authUser.signIn);
    }
    return NextResponse.redirect(new URL(paths.authUser.signIn, req.url));
  }
}

export const config = {
  matcher: ["/dashboard/:path*", "/user/:path*"],
};
