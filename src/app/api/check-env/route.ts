import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    hasSheetId: !!process.env.GOOGLE_SHEET_ID,
    hasServiceAccount: !!process.env.GOOGLE_SERVICE_ACCOUNT_KEY,
    sheetIdLength: process.env.GOOGLE_SHEET_ID?.length || 0,
    serviceAccountLength: process.env.GOOGLE_SERVICE_ACCOUNT_KEY?.length || 0,
    // Show first 20 chars of each for debugging (safe)
    sheetIdPreview: process.env.GOOGLE_SHEET_ID?.substring(0, 20) || "not set",
    serviceAccountPreview: process.env.GOOGLE_SERVICE_ACCOUNT_KEY?.substring(0, 30) || "not set",
  });
}
