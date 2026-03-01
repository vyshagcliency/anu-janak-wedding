import { NextRequest, NextResponse } from "next/server";
import { appendToSheet } from "@/lib/googleSheets";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, guests, events } = body;

    // Format timestamp
    const timestamp = new Date().toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });

    // Format events as comma-separated string
    const eventsList = events.join(", ");

    // Append to Google Sheet
    await appendToSheet([
      timestamp,
      name,
      email,
      phone || "N/A",
      guests,
      eventsList,
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("RSVP submission error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to submit RSVP" },
      { status: 500 }
    );
  }
}
