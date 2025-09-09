import { NextResponse } from "next/server";
import { fetchSiswaWithBerkas } from "@/models/datas/fetch-files";

export async function GET() {
  try {
    const data = await fetchSiswaWithBerkas();
    return NextResponse.json(data);
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch files data" },
      { status: 500 }
    );
  }
}
