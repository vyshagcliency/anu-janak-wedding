import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const RSVP_FILE = path.join(process.cwd(), "data", "rsvp-submissions.json");
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
    const content = await fs.readFile(RSVP_FILE, "utf-8");
    const rsvps = JSON.parse(content);
    return NextResponse.json({ success: true, data: rsvps });
  } catch {
    return NextResponse.json({ success: true, data: [] });
  }
}
