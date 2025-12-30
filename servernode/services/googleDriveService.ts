/**
 * Google Drive Upload Service
 * Handles file uploads to Google Drive
 */

import { google } from 'googleapis';
import * as fs from 'fs';
import * as path from 'path';
import { Readable } from 'stream';


export class GoogleDriveService {
    private drive;

    constructor() {
        let auth;

        // Check if credentials are provided as environment variable (JSON string)
        if (process.env.GOOGLE_DRIVE_CREDENTIALS) {
            try {
                const credentials = JSON.parse(process.env.GOOGLE_DRIVE_CREDENTIALS);
                auth = new google.auth.GoogleAuth({
                    credentials: credentials,
                    scopes: ['https://www.googleapis.com/auth/drive.file'],
                });
            } catch (error) {
                console.error('❌ Error parsing GOOGLE_DRIVE_CREDENTIALS:', error);
                throw new Error('Invalid Google Drive credentials in environment variable');
            }
        } else {
            // Fall back to credentials file
            auth = new google.auth.GoogleAuth({
                keyFile: process.env.GOOGLE_DRIVE_CREDENTIALS_PATH || path.join(__dirname, '../google-credentials.json'),
                scopes: ['https://www.googleapis.com/auth/drive.file'],
            });
        }

        this.drive = google.drive({ version: 'v3', auth });
    }

    /**
     * Upload a file to Google Drive
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

            console.log(`📤 Uploading ${fileName} to Google Drive...`);

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

            console.log(`📤 Uploading ${fileName} to Google Drive from memory...`);
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
            throw error;
        }
    }

    /**
     * Create a folder in Google Drive
     * @param folderName - Name of the folder to create
     * @param parentFolderId - Optional parent folder ID
     * @returns Folder ID of the created folder
     */
    async createFolder(folderName: string, parentFolderId?: string): Promise<string> {
        try {
            const fileMetadata: any = {
                name: folderName,
                mimeType: 'application/vnd.google-apps.folder',
            };

            if (parentFolderId) {
                fileMetadata.parents = [parentFolderId];
            }

            const response = await this.drive.files.create({
                requestBody: fileMetadata,
                fields: 'id, name',
            });

            console.log(`📁 Folder created: ${response.data.name} (ID: ${response.data.id})`);
            return response.data.id || '';
        } catch (error: any) {
            console.error('❌ Error creating folder:', error.message);
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
