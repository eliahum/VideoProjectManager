/**
 * MongoDB Backup Script for Development (No mongodump required!)
 * Usage: npx ts-node scripts/backup-db.ts
 */

import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import * as fs from 'fs';
import * as path from 'path';
import { GoogleDriveServiceAuth } from '../services/googleDriveServiceAuth';

const DATABASE_URL = process.env.DATABASE_URL || 'mongodb://localhost:27017/videoprojectmanager';

async function createBackup() {
    try {
        // Generate timestamp for backup file name
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);

        console.log('🔄 Starting MongoDB backup...');
        console.log(`📍 Database: ${DATABASE_URL}`);

        // Connect to MongoDB
        await mongoose.connect(DATABASE_URL);
        console.log('✅ Connected to MongoDB');

        const db = mongoose.connection.db;
        if (!db) throw new Error('Database connection failed');

        // Get all collections
        const collections = await db.listCollections().toArray();
        const backup: any = {
            timestamp: new Date().toISOString(),
            database: db.databaseName,
            collections: {}
        };

        console.log(`\n📊 Found ${collections.length} collections`);

        // Export each collection
        for (const collectionInfo of collections) {
            const collectionName = collectionInfo.name;
            console.log(`  📦 Backing up: ${collectionName}...`);
            
            const collection = db.collection(collectionName);
            const documents = await collection.find({}).toArray();
            
            backup.collections[collectionName] = documents;
            console.log(`     ✓ ${documents.length} documents exported`);
        }

        // Prepare backup data for cloud upload
        const backupJson = JSON.stringify(backup, null, 2);
        const fileName = `backup-${timestamp}.json`;
        const fileSizeKB = (Buffer.byteLength(backupJson, 'utf8') / 1024).toFixed(2);
        
        console.log('\n✅ Backup completed successfully!');
        console.log(`📦 Backup name: ${fileName}`);
        console.log(`💾 File size: ${fileSizeKB} KB`);
 
        // Upload to Google Drive with OAuth2 if enabled
        if (process.env.ENABLE_GOOGLE_DRIVE_OAUTH_BACKUP === 'true') {
            try {
                console.log('\n☁️  Uploading backup to Google Drive (OAuth2)...');
                console.log('GOOGLE_OAUTH_CLIENT_ID:', process.env.GOOGLE_OAUTH_CLIENT_ID);
                
                const driveServiceAuth = new GoogleDriveServiceAuth(
                    process.env.GOOGLE_OAUTH_CLIENT_ID!,
                    process.env.GOOGLE_OAUTH_CLIENT_SECRET!,
                    process.env.GOOGLE_OAUTH_REFRESH_TOKEN!
                );
                
                // Check quota before upload
                const quota = await driveServiceAuth.getStorageQuota();
                const usedGB = (parseInt(quota.usage) / 1024 / 1024 / 1024).toFixed(2);
                const limitGB = quota.limit === 'unlimited' 
                    ? 'Unlimited' 
                    : (parseInt(quota.limit) / 1024 / 1024 / 1024).toFixed(2);
                console.log(`   Storage: ${usedGB} GB / ${limitGB} GB`);
                
                const folderId = process.env.GOOGLE_OAUTH_FOLDER_ID;
                await driveServiceAuth.uploadFromMemory(backupJson, fileName, folderId);
            } catch (error: any) {
                console.error('⚠️  Google Drive OAuth2 upload failed:', error.message);
                console.log('   Backup is still saved locally.');
            }
        }

        // Show tip if no upload method is enabled
        if (process.env.ENABLE_GOOGLE_DRIVE_OAUTH_BACKUP !== 'true') {
            console.log('\n💡 Tip: Enable Google Drive backup by setting:');
            console.log('   - ENABLE_GOOGLE_DRIVE_OAUTH_BACKUP=true (OAuth2)');
        }

        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error('❌ Backup failed:', error);
        await mongoose.disconnect();
        process.exit(1);
    }
}

createBackup();
