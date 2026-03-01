# RSVP Data Storage

RSVP submissions are now stored in **Google Sheets** instead of local files.

## Setup Instructions

Follow the detailed guide in `GOOGLE_SHEETS_SETUP.md` at the root of this project.

## Accessing RSVP Data

1. **Via Google Sheets**: Open your Google Sheet directly to view all submissions in real-time
2. **Via Admin Page**: Visit `/admin/rsvp` on your website and enter password: `anu@123#34`

## Benefits of Google Sheets

✅ Works in production (Vercel, Netlify, etc.)
✅ Easy to view and share with family
✅ No database hosting costs
✅ Automatic backups by Google
✅ Export to Excel/CSV anytime
✅ Real-time updates

## Legacy Note

This directory previously stored `rsvp-submissions.json` for local development.
That has been replaced with Google Sheets integration.
