import { NextRequest, NextResponse } from "next/server";
import { getSheetData } from "@/lib/googleSheets";

const ADMIN_PASSWORD = "anu@123#34";

export async function GET(request: NextRequest) {
  // Check authorization
  const authHeader = request.headers.get("authorization");
  if (!authHeader || authHeader !== `Bearer ${ADMIN_PASSWORD}`) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const rsvps = await getSheetData();
    return NextResponse.json({ success: true, data: rsvps });
  } catch (error) {
    console.error("Error fetching RSVPs:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch RSVPs" },
      { status: 500 }
    );
  }
}
