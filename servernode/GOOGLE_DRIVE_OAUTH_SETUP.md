# Google Drive OAuth2 Backup Configuration Guide

This guide explains how to set up Google Drive uploads using OAuth2 authentication to upload backups to a **personal Google account** (not a service account).

## When to Use OAuth2 vs Service Account?

### Use OAuth2 When:
- You want to upload to **your personal Google Drive**
- You have a regular Gmail account (not Google Workspace)
- You want files to use **your storage quota**
- You want full control as the file owner

### Use Service Account When:
- You want automated background uploads
- You're using Google Workspace with Shared Drives
- You want to share access with multiple services

## Prerequisites

- Google Cloud Platform account
- Node.js project with googleapis installed
- Personal Google account (Gmail)

## Setup Steps

### 1. Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Note your project ID

### 2. Enable Google Drive API

1. In the Google Cloud Console, navigate to **APIs & Services** > **Library**
2. Search for "Google Drive API"
3. Click **Enable**

### 3. Configure OAuth Consent Screen (IMPORTANT!)

1. Navigate to **APIs & Services** > **OAuth consent screen**
2. User Type: Select **External** and click **Create**
3. **App information:**
   - App name: `Video Project Manager Backup` (or any name)
   - User support email: **Your email address**
   - Developer contact information: **Your email address**
   - Click **Save and Continue**
4. **Scopes:** Click **Save and Continue** (skip this step)
5. **Test users (CRITICAL!):**
   - Click **+ ADD USERS**
   - Enter **your full Gmail address** (e.g., `yourname@gmail.com`)
   - This is the account you'll use to authorize the app
   - Click **Save**
   - Click **Save and Continue**
6. **Summary:** Click **Back to Dashboard**

### 4. Create OAuth2 Credentials

1. Navigate to **APIs & Services** > **Credentials**
2. Click **+ CREATE CREDENTIALS** > **OAuth client ID**
3. Application type: **Web application**
4. Name: `Backup Web Client`
5. **Authorized redirect URIs:**
   - Click **+ ADD URI**
   - Enter: `http://localhost:4200`
   - Click **CREATE**
6. A popup will appear with your credentials - **copy both:**
   - `Client ID` (e.g., `384285872846-xxx.apps.googleusercontent.com`)
   - `Client secret` (e.g., `GOCSPX-xxxxx`)
7. Click **OK**

### 5. Get Refresh Token

You need to authorize your app once and get a refresh token. Follow these steps:

#### Step 1: Update the get-oauth-token.ts script

Edit `scripts/get-oauth-token.ts` and replace the CLIENT_ID, CLIENT_SECRET, and REDIRECT_URI with your values:

```typescript
// scripts/get-oauth-token.ts
import { google } from 'googleapis';
import * as readline from 'readline';

const CLIENT_ID = '384285872846-xxx.apps.googleusercontent.com'; // Your Client ID
const CLIENT_SECRET = 'GOCSPX-xxxxx'; // Your Client Secret
const REDIRECT_URI = 'http://localhost:4200'; // Must match the one in Google Cloud Console

const oauth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
);

const SCOPES = ['https://www.googleapis.com/auth/drive.file'];

const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
    prompt: 'consent', // Force to get refresh token
});

console.log('🔐 OAuth2 Token Generator');
console.log('=========================\n');
console.log('📋 Step 1: Authorize this app by visiting this URL:');
console.log('\n' + authUrl + '\n');
console.log('📋 Step 2: After authorization, you will be redirected to a URL like:');
console.log('   http://localhost:4200/?code=AUTHORIZATION_CODE&scope=...');
console.log('\n📋 Step 3: Copy the AUTHORIZATION_CODE from the URL\n');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

rl.question('Enter the authorization code here: ', async (code) => {
    rl.close();
    
    try {
        const { tokens } = await oauth2Client.getToken(code.trim());
        
        console.log('\n✅ Success! Here are your tokens:\n');
        console.log('🔄 Refresh Token (save this!):', tokens.refresh_token);
        console.log('\n📝 Add this to your .env file:');
        console.log('-----------------------------------');
        console.log(`ENABLE_GOOGLE_DRIVE_OAUTH_BACKUP=true`);
        console.log(`GOOGLE_OAUTH_CLIENT_ID=${CLIENT_ID}`);
        console.log(`GOOGLE_OAUTH_CLIENT_SECRET=${CLIENT_SECRET}`);
        console.log(`GOOGLE_OAUTH_REFRESH_TOKEN=${tokens.refresh_token}`);
        console.log('-----------------------------------\n');
    } catch (error: any) {
        console.error('\n❌ Error getting tokens:', error.message);
        console.log('\n💡 Tips:');
        console.log('   - Make sure you copied the FULL authorization code');
        console.log('   - The code should not contain spaces');
        console.log('   - Try generating a new code if this one expired');
    }
});
```

#### Step 2: Run the script

```bash
cd servernode
npx ts-node scripts/get-oauth-token.ts
```

#### Step 3: Authorize the app

1. **Copy the URL** that appears in the terminal
2. **Open it in your browser**
3. **Sign in** with the Google account you added as a Test User
4. You may see "Google hasn't verified this app":
   - Click **Advanced**
   - Click **Go to Video Project Manager Backup (unsafe)**
   - This is normal for apps in Testing mode
5. **Click "Continue"** or **"Allow"** to grant permissions
6. You'll be redirected to `http://localhost:4200/?code=...`
   - The page might show an error or your Angular app - **this is OK!**
7. **Copy the entire URL** from the browser's address bar

#### Step 4: Extract the authorization code

From the URL:
```
http://localhost:4200/?code=4/0AeanRRrt...xxxxx&scope=https://www.googleapis...
```

Copy only the part **after `code=` and before `&scope`**:
```
4/0AeanRRrt...xxxxx
```

#### Step 5: Paste the code

1. Go back to the terminal
2. Paste the authorization code
3. Press **Enter**
4. The script will display your **refresh_token**
5. **Save this token** - you'll need it in the next step!

### 6. Configure Environment Variables

Add these variables to your `.env` file in the `servernode` directory:

```env
# Google Drive OAuth2 Configuration
ENABLE_GOOGLE_DRIVE_OAUTH_BACKUP=true
GOOGLE_OAUTH_CLIENT_ID=your-client-id-here
GOOGLE_OAUTH_CLIENT_SECRET=your-client-secret-here
GOOGLE_OAUTH_REFRESH_TOKEN=your-refresh-token-here
GOOGLE_OAUTH_FOLDER_ID=your-folder-id-here
```

**Environment Variables Explained:**

- `ENABLE_GOOGLE_DRIVE_OAUTH_BACKUP`: Set to `true` to enable OAuth2 uploads
- `GOOGLE_OAUTH_CLIENT_ID`: Client ID from OAuth2 credentials
- `GOOGLE_OAUTH_CLIENT_SECRET`: Client secret from OAuth2 credentials
- `GOOGLE_OAUTH_REFRESH_TOKEN`: Refresh token from authorization step
- `GOOGLE_OAUTH_FOLDER_ID`: (Optional) Folder ID where backups will be uploaded

### 7. Using in Your Code

```typescript
import { GoogleDriveServiceAuth } from './services/googleDriveServiceAuth';

// Initialize the service
const driveAuth = new GoogleDriveServiceAuth(
    process.env.GOOGLE_OAUTH_CLIENT_ID!,
    process.env.GOOGLE_OAUTH_CLIENT_SECRET!,
    process.env.GOOGLE_OAUTH_REFRESH_TOKEN!
);

// Upload a file
const fileId = await driveAuth.uploadFile(
    'backups/backup-2025-12-30.json',
    process.env.GOOGLE_OAUTH_FOLDER_ID
);

// Check storage quota
const quota = await driveAuth.getStorageQuota();
console.log('Storage used:', quota.usage);
console.log('Storage limit:', quota.limit);

// List files
const files = await driveAuth.listFiles();
console.log('Files:', files);

// Delete a file
await driveAuth.deleteFile(fileId);
```

### 8. Test the Configuration

Create a test script:

```typescript
// scripts/test-oauth-upload.ts
import dotenv from 'dotenv';
dotenv.config();
import { GoogleDriveServiceAuth } from '../services/googleDriveServiceAuth';
import * as fs from 'fs';

async function testUpload() {
    try {
        const driveAuth = new GoogleDriveServiceAuth(
            process.env.GOOGLE_OAUTH_CLIENT_ID!,
            process.env.GOOGLE_OAUTH_CLIENT_SECRET!,
            process.env.GOOGLE_OAUTH_REFRESH_TOKEN!
        );

        // Check quota first
        console.log('📊 Checking storage quota...');
        const quota = await driveAuth.getStorageQuota();
        const usedGB = (parseInt(quota.usage) / 1024 / 1024 / 1024).toFixed(2);
        const limitGB = quota.limit === 'unlimited' 
            ? 'Unlimited' 
            : (parseInt(quota.limit) / 1024 / 1024 / 1024).toFixed(2);
        
        console.log(`   Used: ${usedGB} GB`);
        console.log(`   Limit: ${limitGB} GB`);

        // Create test file
        const testFile = 'test-upload.json';
        fs.writeFileSync(testFile, JSON.stringify({ test: true, timestamp: new Date() }));

        // Upload
        const fileId = await driveAuth.uploadFile(testFile);
        console.log('✅ Test upload successful!');

        // Cleanup
        fs.unlinkSync(testFile);
    } catch (error) {
        console.error('❌ Test failed:', error);
    }
}

testUpload();
```

Run:
```bash
npx ts-node scripts/test-oauth-upload.ts
```

## Troubleshooting

### Error: "403: access_denied"
- **Most common issue**: You didn't add yourself as a Test User
- Go to **APIs & Services** > **OAuth consent screen** > **Audience** tab
- Click **+ ADD USERS** and add your Gmail address
- Wait 2-3 minutes and try again
- Make sure you're signing in with the SAME account you added as Test User

### Error: "The OAuth client was not found"
- The Client ID in your script doesn't match Google Cloud Console
- Go to **APIs & Services** > **Credentials** and verify your Client ID
- Update the `CLIENT_ID` in `get-oauth-token.ts`

### Error: "redirect_uri_mismatch"
- The redirect URI in your script doesn't match Google Cloud Console
- Go to **APIs & Services** > **Credentials** > Your OAuth Client
- Make sure `http://localhost:4200` is listed under **Authorized redirect URIs**
- Update the `REDIRECT_URI` in `get-oauth-token.ts` to match exactly

### Error: "invalid_grant"
- Your refresh token may have expired
- Re-run the get-oauth-token script to get a new token
- Make sure you copied the entire token without spaces

### Error: "The user's Drive storage quota has been exceeded"
- Your Google Drive is full
- Check quota with `getStorageQuota()`
- Delete old files or upgrade your Google storage plan

### Can't find "Test users" section
- Make sure you're in **APIs & Services** > **OAuth consent screen**
- Click on the **Audience** tab (left sidebar)
- Or scroll down after clicking **Edit App Registration**

## Important Notes

### Testing Mode
- Your app starts in "Testing" mode
- Only Test Users can authorize the app
- You can add up to 100 test users
- **Don't publish** the app unless you want public access

### Refresh Token Expiration
- Refresh tokens for testing apps may expire after 7 days if not used
- Production apps have longer-lived tokens
- If expired, just run `get-oauth-token.ts` again

1. **Never commit credentials**: Add `.env` to `.gitignore`
2. **Rotate tokens**: Regenerate refresh tokens periodically
3. **Limit scopes**: Only request `drive.file` scope (not full drive access)
4. **Use environment variables**: Never hardcode secrets in code
5. **Secure storage**: Store `.env` file securely, encrypt if needed

## Comparison: Service Account vs OAuth2

| Feature | Service Account | OAuth2 |
|---------|----------------|--------|
| Storage | Uses shared folder owner's quota | Uses your personal quota |
| Authentication | JSON key file | Client ID + Secret + Refresh Token |
| User interaction | None needed | One-time authorization |
| Best for | Automated systems | Personal use |
| Quota limit | Depends on folder owner | 15 GB (free) or more (paid) |
| File ownership | Service account email | Your personal account |

## Getting More Storage

If you run out of space:
- **Google One**: $1.99/month for 100 GB
- **Delete old backups**: Implement auto-cleanup
- **Compress backups**: Use gzip compression
- **Use Service Account with Workspace**: Shared Drives have no quota

## Next Steps

- Implement automatic cleanup of old backups
- Set up scheduled backups with cron jobs
- Add error notifications via email/Slack
- Monitor storage usage regularly
