import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const RSVP_FILE = path.join(process.cwd(), "data", "rsvp-submissions.json");

// Ensure data directory exists
async function ensureDataDir() {
  const dataDir = path.join(process.cwd(), "data");
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }
}

// Read existing RSVPs
async function readRSVPs() {
  try {
    await ensureDataDir();
    const content = await fs.readFile(RSVP_FILE, "utf-8");
    return JSON.parse(content);
  } catch {
    return [];
  }
}

// Write RSVPs
async function writeRSVPs(data: any[]) {
  await ensureDataDir();
  await fs.writeFile(RSVP_FILE, JSON.stringify(data, null, 2));
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const submission = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      ...body,
    };

    const rsvps = await readRSVPs();
    rsvps.push(submission);
    await writeRSVPs(rsvps);

    return NextResponse.json({ success: true, id: submission.id });
  } catch (error) {
    console.error("RSVP submission error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to submit RSVP" },
      { status: 500 }
    );
  }
}
