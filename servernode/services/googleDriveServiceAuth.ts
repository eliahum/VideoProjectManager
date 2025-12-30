/**
 * Google Drive Service with OAuth2 Authentication
 * Uploads files to user's personal Google Drive using OAuth2
 */

import { google } from 'googleapis';
import * as fs from 'fs';
import * as path from 'path';
import { Readable } from 'stream';

export class GoogleDriveServiceAuth {
    private drive;

    /**
     * Creates a new GoogleDriveServiceAuth instance
     * @param clientId - OAuth2 Client ID
     * @param clientSecret - OAuth2 Client Secret
     * @param refreshToken - OAuth2 Refresh Token
     */
    constructor(clientId: string, clientSecret: string, refreshToken: string) {
        const oauth2Client = new google.auth.OAuth2(
            clientId,
            clientSecret,
            'urn:ietf:wg:oauth:2.0:oob' // Redirect URI for installed apps
        );

        oauth2Client.setCredentials({
            refresh_token: refreshToken,
        });

        this.drive = google.drive({ version: 'v3', auth: oauth2Client });
    }

    /**
     * Upload a file to Google Drive using OAuth2
     * @param filePath - Path to the file to upload
     * @param folderId - Optional Google Drive folder ID to upload to
     * @returns File ID of the uploaded file
     */
    async uploadFile(filePath: string, folderId?: string): Promise<string> {
        try {
            const fileName = path.basename(filePath);
            const fileMetadata: any = {
                name: fileName,
            };

            // If folder ID is provided, upload to that folder
            if (folderId) {
                fileMetadata.parents = [folderId];
            }

            const media = {
                mimeType: 'application/json',
                body: fs.createReadStream(filePath),
            };

            console.log(`📤 Uploading ${fileName} to Google Drive (OAuth2)...`);

            const response = await this.drive.files.create({
                requestBody: fileMetadata,
                media: media,
                fields: 'id, name, webViewLink',
            });

            console.log(`✅ File uploaded successfully!`);
            console.log(`   File ID: ${response.data.id}`);
            console.log(`   File Name: ${response.data.name}`);
            if (response.data.webViewLink) {
                console.log(`   View Link: ${response.data.webViewLink}`);
            }

            return response.data.id || '';
        } catch (error: any) {
            console.error('❌ Error uploading to Google Drive:', error.message);
            if (error.code === 403) {
                console.error('💡 Tip: User may have exceeded storage quota or permissions issue');
            }
            throw error;
        }
    }

    /**
     * Upload data from memory to Google Drive (like MemoryStream in .NET)
     * @param data - String or Buffer to upload
     * @param fileName - Name for the file in Google Drive
     * @param folderId - Optional Google Drive folder ID to upload to
     * @returns File ID of the uploaded file
     */
    async uploadFromMemory(data: string | Buffer, fileName: string, folderId?: string): Promise<string> {
        try {
            const fileMetadata: any = {
                name: fileName,
            };

            // If folder ID is provided, upload to that folder
            if (folderId) {
                fileMetadata.parents = [folderId];
            }

            // Convert string or Buffer to Readable stream
            const buffer = typeof data === 'string' ? Buffer.from(data) : data;
            const stream = Readable.from(buffer);

            const media = {
                mimeType: 'application/json',
                body: stream,
            };

            console.log(`📤 Uploading ${fileName} to Google Drive from memory (OAuth2)...`);
            const sizeKB = (buffer.length / 1024).toFixed(2);
            console.log(`   Size: ${sizeKB} KB`);

            const response = await this.drive.files.create({
                requestBody: fileMetadata,
                media: media,
                fields: 'id, name, webViewLink',
            });

            console.log(`✅ File uploaded successfully!`);
            console.log(`   File ID: ${response.data.id}`);
            console.log(`   File Name: ${response.data.name}`);
            if (response.data.webViewLink) {
                console.log(`   View Link: ${response.data.webViewLink}`);
            }

            return response.data.id || '';
        } catch (error: any) {
            console.error('❌ Error uploading to Google Drive:', error.message);
            if (error.code === 403) {
                console.error('💡 Tip: User may have exceeded storage quota or permissions issue');
            }
            throw error;
        }
    }

    /**
     * List files in Google Drive
     * @param folderId - Optional folder ID to list files from
     * @returns Array of files
     */
    async listFiles(folderId?: string): Promise<any[]> {
        try {
            let query = "trashed=false";
            if (folderId) {
                query += ` and '${folderId}' in parents`;
            }

            const response = await this.drive.files.list({
                q: query,
                fields: 'files(id, name, size, createdTime, webViewLink)',
                orderBy: 'createdTime desc',
            });

            return response.data.files || [];
        } catch (error: any) {
            console.error('❌ Error listing files:', error.message);
            throw error;
        }
    }

    /**
     * Get user's storage quota information
     * @returns Storage quota details
     */
    async getStorageQuota(): Promise<{ limit: string; usage: string; usageInDrive: string }> {
        try {
            const response = await this.drive.about.get({
                fields: 'storageQuota',
            });

            const quota = response.data.storageQuota;
            return {
                limit: quota?.limit || 'unlimited',
                usage: quota?.usage || '0',
                usageInDrive: quota?.usageInDrive || '0',
            };
        } catch (error: any) {
            console.error('❌ Error getting storage quota:', error.message);
            throw error;
        }
    }

    /**
     * Delete a file from Google Drive
     * @param fileId - ID of the file to delete
     */
    async deleteFile(fileId: string): Promise<void> {
        try {
            await this.drive.files.delete({
                fileId: fileId,
            });
            console.log(`🗑️ File deleted: ${fileId}`);
        } catch (error: any) {
            console.error('❌ Error deleting file:', error.message);
            throw error;
        }
    }
}
