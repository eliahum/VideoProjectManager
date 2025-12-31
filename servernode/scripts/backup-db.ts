/**
 * MongoDB Backup Script for Development (No mongodump required!)
 * Usage: npx ts-node scripts/backup-db.ts
 */

import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import { BackupService } from '../services/backupService';

const DATABASE_URL = process.env.DATABASE_URL || 'mongodb://localhost:27017/videoprojectmanager';

async function createBackup() {
    try {
        console.log('🔄 Starting MongoDB backup script...');
        console.log(`📍 Database: ${DATABASE_URL}`);

        // Connect to MongoDB
        await mongoose.connect(DATABASE_URL);
        console.log('✅ Connected to MongoDB');

        // Use BackupService to create backup
        const backupService = new BackupService();
        const result = await backupService.createBackup();

        console.log('\n✅ Backup completed successfully!');
        console.log(`📦 Backup name: ${result.filename}`);
        console.log(`💾 File size: ${(result.size / 1024).toFixed(2)} KB`);
        console.log(`☁️  Uploaded to cloud: ${result.uploadedToCloud ? 'Yes' : 'No'}`);

        // Cleanup old backups (keep last 90 days)
        console.log('\n🧹 Cleaning up old backups...');
        const deletedCount = await backupService.cleanupOldBackups(90);
        console.log(`🗑️  Deleted ${deletedCount} old backup(s)`);

        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error('❌ Backup failed:', error);
        await mongoose.disconnect();
        process.exit(1);
    }
}

createBackup();
