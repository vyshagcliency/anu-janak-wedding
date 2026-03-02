import { google } from "googleapis";

// Get credentials from environment variables
const getGoogleAuth = () => {
  const credentialsJson = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
  if (!credentialsJson) {
    throw new Error("GOOGLE_SERVICE_ACCOUNT_KEY environment variable is not set");
  }

  let credentials;
  try {
    credentials = JSON.parse(credentialsJson);

    // Fix the private key format
    if (credentials.private_key) {
      // Replace literal \n with actual newlines
      credentials.private_key = credentials.private_key.replace(/\\n/g, '\n');

      // Remove extra spaces that may have been added during copy/paste
      // These extra spaces break the key format
      credentials.private_key = credentials.private_key
        .replace(/-----BEGIN PRIVATE\s+KEY-----/g, '-----BEGIN PRIVATE KEY-----')
        .replace(/-----END PRIVATE\s+KEY-----/g, '-----END PRIVATE KEY-----')
        // Remove spaces from the middle of base64 lines
        .split('\n')
        .map((line: string) => {
          // Only remove spaces from base64 content, not from BEGIN/END markers
          if (line.includes('-----')) {
            return line;
          }
          return line.replace(/\s+/g, '');
        })
        .join('\n');
    }
  } catch (error) {
    console.error("Failed to parse GOOGLE_SERVICE_ACCOUNT_KEY:", error);
    throw new Error("Invalid GOOGLE_SERVICE_ACCOUNT_KEY format");
  }

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    projectId: credentials.project_id,
  });

  return auth;
};

export async function appendToSheet(values: any[]) {
  try {
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
  } catch (error: any) {
    console.error("Error appending to sheet:", error);
    if (error.response) {
      console.error("Response data:", error.response.data);
      console.error("Response status:", error.response.status);
    }
    throw error;
  }
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
