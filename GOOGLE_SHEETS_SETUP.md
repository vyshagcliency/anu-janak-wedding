# Google Sheets Setup for RSVP Storage

This guide will help you set up Google Sheets to store RSVP submissions.

## Step 1: Create a Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it **"Wedding RSVP Submissions"**
4. Add these headers in the first row (Row 1):
   - **A1**: Timestamp
   - **B1**: Name
   - **C1**: Email
   - **D1**: Phone
   - **E1**: Guests
   - **F1**: Events

5. Copy the **Sheet ID** from the URL:
   ```
   https://docs.google.com/spreadsheets/d/[COPY_THIS_PART]/edit
   ```
   Example: If URL is `https://docs.google.com/spreadsheets/d/1a2b3c4d5e6f7g8h9i0/edit`
   Then Sheet ID is: `1a2b3c4d5e6f7g8h9i0`

## Step 2: Set Up Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click **Select a project** → **New Project**
3. Name it "Wedding Website" (or any name)
4. Click **Create**

## Step 3: Enable Google Sheets API

1. In the Google Cloud Console, search for **"Google Sheets API"** in the top search bar
2. Click on **Google Sheets API**
3. Click **Enable**

## Step 4: Create Service Account

1. Go to **Navigation Menu** (☰) → **APIs & Services** → **Credentials**
2. Click **+ Create Credentials** → **Service Account**
3. Fill in:
   - **Service account name**: `wedding-rsvp-bot`
   - **Service account ID**: (auto-filled)
4. Click **Create and Continue**
5. Skip "Grant this service account access to project" (click **Continue**)
6. Skip "Grant users access to this service account" (click **Done**)

## Step 5: Generate JSON Key

1. Click on the service account you just created (wedding-rsvp-bot@...)
2. Go to the **Keys** tab
3. Click **Add Key** → **Create New Key**
4. Choose **JSON** format
5. Click **Create**
6. A JSON file will download - **SAVE THIS FILE SAFELY!**

## Step 6: Share Sheet with Service Account

1. Open the JSON file you just downloaded
2. Find and copy the **"client_email"** value (looks like: `wedding-rsvp-bot@project-name.iam.gserviceaccount.com`)
3. Go back to your Google Sheet
4. Click the **Share** button (top right)
5. Paste the service account email
6. Change permissions to **Editor**
7. **UNCHECK** "Notify people"
8. Click **Share**

## Step 7: Configure Environment Variables

1. In your project folder, create a file named `.env.local`
2. Copy the contents from `.env.example`
3. Update the values:

```env
# Paste your Sheet ID from Step 1
GOOGLE_SHEET_ID=1a2b3c4d5e6f7g8h9i0

# Paste the ENTIRE contents of your downloaded JSON file (as one line)
GOOGLE_SERVICE_ACCOUNT_KEY='{"type":"service_account","project_id":"wedding-website-123456","private_key_id":"abc123...","private_key":"-----BEGIN PRIVATE KEY-----\n...","client_email":"wedding-rsvp-bot@wedding-website-123456.iam.gserviceaccount.com",...}'
```

**Important**: The JSON must be on a single line, wrapped in single quotes!

## Step 8: Deploy to Vercel

1. Push your code to GitHub
2. Go to [Vercel Dashboard](https://vercel.com)
3. Import your repository
4. Go to **Settings** → **Environment Variables**
5. Add both variables:
   - `GOOGLE_SHEET_ID` = your sheet ID
   - `GOOGLE_SERVICE_ACCOUNT_KEY` = your JSON content (entire JSON as one line)
6. Redeploy your site

## Testing

1. Submit a test RSVP on your website
2. Check your Google Sheet - you should see a new row!
3. Visit `/admin/rsvp` with password `anu@123#34` to view submissions

## Troubleshooting

### "Failed to submit RSVP"
- Check that you shared the sheet with the service account email
- Verify the sheet ID is correct
- Make sure the JSON key is valid

### "Unauthorized" error
- Verify the service account has Editor permissions on the sheet
- Check that Google Sheets API is enabled

### Can't see submissions
- Make sure the sheet name is "Sheet1" (or update the code in `src/lib/googleSheets.ts`)
- Check that headers are in the first row (A1-F1)

## Security Note

⚠️ **NEVER commit the `.env.local` file or the service account JSON file to GitHub!**

These files contain sensitive credentials. They are already in `.gitignore`.
