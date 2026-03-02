import { NextRequest, NextResponse } from "next/server";
import { appendToSheet } from "@/lib/googleSheets";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, guests, events } = body;

    // Validate required fields
    if (!name || !email || !guests || !events || events.length === 0) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Format timestamp
    const timestamp = new Date().toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });

    // Format events as comma-separated string
    const eventsList = Array.isArray(events) ? events.join(", ") : events;

    console.log("Attempting to append to sheet:", {
      timestamp,
      name,
      email,
      phone: phone || "N/A",
      guests,
      eventsList,
    });

    // Append to Google Sheet
    await appendToSheet([
      timestamp,
      name,
      email,
      phone || "N/A",
      guests,
      eventsList,
    ]);

    console.log("Successfully appended to sheet");
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("RSVP submission error:", error);
    console.error("Error details:", {
      message: error.message,
      stack: error.stack,
    });

    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to submit RSVP",
        details: process.env.NODE_ENV === "development" ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
