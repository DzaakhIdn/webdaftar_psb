// lib/getCurrentUser.ts
import { cookies } from "next/headers";

export async function getCurrentUser() {
  const cookieStore = await cookies(); // ambil cookie auth
  const token = cookieStore.get("auth_token")?.value;

  if (!token) return null;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/verify`,
      {
        headers: {
          Cookie: `auth_token=${token}`,
        },
        cache: "no-store",
      }
    );

    if (!res.ok) return null;

    const data = await res.json();
    return data.user;
  } catch (err) {
    return null;
  }
}
