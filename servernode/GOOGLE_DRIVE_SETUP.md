# Google Drive Backup Configuration Guide

This guide explains how to set up automatic Google Drive uploads for database backups.

## Prerequisites

- Google Cloud Platform account
- Node.js project with googleapis installed

## Setup Steps

### 1. Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Note your project ID

### 2. Enable Google Drive API

1. In the Google Cloud Console, navigate to **APIs & Services** > **Library**
2. Search for "Google Drive API"
3. Click **Enable**

### 3. Create Service Account Credentials

1. Navigate to **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **Service Account**
3. Fill in the service account details:
   - Name: `backup-uploader` (or any name you prefer)
   - Description: "Service account for uploading backups to Google Drive"
4. Click **Create and Continue**
5. Grant the service account access (optional, you can skip this step)
6. Click **Done**

### 4. Create and Download Credentials JSON

1. Click on the newly created service account email
2. Go to the **Keys** tab
3. Click **Add Key** > **Create New Key**
4. Select **JSON** format
5. Click **Create**
6. A JSON file will be downloaded automatically
7. **Important**: Save this file securely - it contains sensitive credentials

### 5. Configure Your Project

1. Rename the downloaded JSON file to `google-credentials.json`
2. Move it to your `servernode` directory:
   ```
   VideoProjectManager/
   └── servernode/
       ├── google-credentials.json  ← Place file here
       ├── scripts/
       └── services/
   ```
3. **Security**: Add `google-credentials.json` to your `.gitignore` file to prevent committing credentials

### 6. Set Up Google Drive Folder (Optional but Recommended)

1. Go to [Google Drive](https://drive.google.com/)
2. Create a new folder for backups (e.g., "Database Backups")
3. Right-click the folder > **Share**
4. Share the folder with the service account email (found in your credentials JSON, looks like: `backup-uploader@project-id.iam.gserviceaccount.com`)
5. Grant **Editor** permissions
6. Copy the folder ID from the URL:
   - URL format: `https://drive.google.com/drive/folders/FOLDER_ID_HERE`
   - The folder ID is the long string after `/folders/`

### 7. Configure Environment Variables

Add these variables to your `.env` file in the `servernode` directory:

```env
# Google Drive Backup Configuration
ENABLE_GOOGLE_DRIVE_BACKUP=true
GOOGLE_DRIVE_CREDENTIALS_PATH=./google-credentials.json
GOOGLE_DRIVE_BACKUP_FOLDER_ID=your-folder-id-here
```

**Environment Variables Explained:**

- `ENABLE_GOOGLE_DRIVE_BACKUP`: Set to `true` to enable automatic uploads
- `GOOGLE_DRIVE_CREDENTIALS_PATH`: Path to your credentials JSON file (relative to servernode directory)
- `GOOGLE_DRIVE_BACKUP_FOLDER_ID`: (Optional) The folder ID where backups will be uploaded. If omitted, files will be uploaded to the root of the service account's Drive

### 8. Test the Configuration

Run the backup script:

```bash
cd servernode
npx ts-node scripts/backup-db.ts
```

You should see:
- Local backup created successfully
- Upload to Google Drive initiated
- Success message with file ID and view link

## Troubleshooting

### Error: "Invalid Credentials"

- Verify that `google-credentials.json` exists in the correct location
- Check that the path in `GOOGLE_DRIVE_CREDENTIALS_PATH` is correct
- Ensure the JSON file hasn't been modified

### Error: "Insufficient Permission"

- Verify that Google Drive API is enabled in your Google Cloud Project
- Check that the service account has Editor permissions on the target folder
- Ensure the folder is shared with the service account email

### Error: "File Not Found"

- Verify the folder ID is correct
- Make sure the folder exists and is accessible to the service account

### Upload Fails but Backup Succeeds

- The backup will still be saved locally even if Google Drive upload fails
- Check the error message for specific details
- Verify your internet connection

## Security Best Practices

1. **Never commit credentials**: Always add `google-credentials.json` to `.gitignore`
2. **Use environment variables**: Store sensitive configuration in `.env` files
3. **Limit permissions**: Only grant the service account access to the specific backup folder
4. **Rotate credentials**: Periodically create new service account keys and delete old ones
5. **Monitor access**: Regularly check Google Cloud Console for unexpected API usage

## Alternative: Using OAuth 2.0 (Advanced)

For production environments, consider using OAuth 2.0 instead of service accounts:

1. Create OAuth 2.0 credentials in Google Cloud Console
2. Implement OAuth flow to obtain user consent
3. Store refresh tokens securely
4. Update the GoogleDriveService to use OAuth credentials

This method provides better security for user-specific uploads but requires more complex implementation.

## Managing Backups in Google Drive

The script creates backups with timestamps in the filename. To manage storage:

1. Set up a Google Drive retention policy
2. Use Google Drive API to list and delete old backups
3. Consider implementing auto-cleanup in the backup script

## Example: Cleanup Script

You can extend the backup script to also clean up old backups from Google Drive:

```typescript
// In backup-db.ts, after uploading
const driveFiles = await driveService.listFiles(folderId);
const oldBackups = driveFiles
    .filter(f => f.name.startsWith('backup-'))
    .slice(10); // Keep only 10 most recent

for (const file of oldBackups) {
    await driveService.deleteFile(file.id);
}
```

## Support

If you encounter issues:
1. Check the [Google Drive API documentation](https://developers.google.com/drive/api/guides/about-sdk)
2. Review the [googleapis npm package](https://www.npmjs.com/package/googleapis)
3. Check Google Cloud Console logs for API errors
