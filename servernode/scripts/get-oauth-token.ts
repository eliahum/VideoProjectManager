/**
 * Get OAuth2 Refresh Token
 * Run this script once to get your refresh token
 * Usage: npx ts-node scripts/get-oauth-token.ts
 */

import dotenv from 'dotenv';
dotenv.config();
import { google } from 'googleapis';
import * as readline from 'readline';

const CLIENT_ID = process.env.GOOGLE_OAUTH_CLIENT_ID || 'YOUR_CLIENT_ID_HERE';
const CLIENT_SECRET = process.env.GOOGLE_OAUTH_CLIENT_SECRET || 'YOUR_CLIENT_SECRET_HERE';
const REDIRECT_URI = process.env.GOOGLE_OAUTH_REDIRECT_URI || 'http://localhost:4200';

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
console.log('   http://localhost/?code=AUTHORIZATION_CODE&scope=...');
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
        console.log('🔑 Access Token (expires):', tokens.access_token);
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
