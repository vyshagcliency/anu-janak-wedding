import { google } from "googleapis";

// Get credentials from environment variables
const getGoogleAuth = () => {
  const credentials = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
  if (!credentials) {
    throw new Error("GOOGLE_SERVICE_ACCOUNT_KEY environment variable is not set");
  }

  const auth = new google.auth.GoogleAuth({
    credentials: JSON.parse(credentials),
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  return auth;
};

export async function appendToSheet(values: any[]) {
  const auth = getGoogleAuth();
  const sheets = google.sheets({ version: "v4", auth });

  const spreadsheetId = process.env.GOOGLE_SHEET_ID;
  if (!spreadsheetId) {
    throw new Error("GOOGLE_SHEET_ID environment variable is not set");
  }

  const response = await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: "Sheet1!A:F", // Adjust if your sheet has a different name
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [values],
    },
  });

  return response.data;
}

export async function getSheetData() {
  const auth = getGoogleAuth();
  const sheets = google.sheets({ version: "v4", auth });

  const spreadsheetId = process.env.GOOGLE_SHEET_ID;
  if (!spreadsheetId) {
    throw new Error("GOOGLE_SHEET_ID environment variable is not set");
  }

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: "Sheet1!A:F", // Adjust if your sheet has a different name
  });

  const rows = response.data.values || [];

  // Skip header row and convert to objects
  if (rows.length <= 1) {
    return [];
  }

  return rows.slice(1).map((row, index) => ({
    id: (index + 1).toString(),
    timestamp: row[0] || "",
    name: row[1] || "",
    email: row[2] || "",
    phone: row[3] || "",
    guests: row[4] || "",
    events: row[5] ? row[5].split(", ") : [],
  }));
}
