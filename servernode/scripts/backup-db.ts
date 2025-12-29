/**
 * MongoDB Backup Script for Development (No mongodump required!)
 * Usage: npx ts-node scripts/backup-db.ts
 */

import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import * as fs from 'fs';
import * as path from 'path';

const DATABASE_URL = process.env.DATABASE_URL || 'mongodb://localhost:27017/videoprojectmanager';
const BACKUP_DIR = path.join(__dirname, '../backups');

async function createBackup() {
    try {
        // Create backups directory if it doesn't exist
        if (!fs.existsSync(BACKUP_DIR)) {
            fs.mkdirSync(BACKUP_DIR, { recursive: true });
            console.log('📁 Created backups directory');
        }

        // Generate timestamp for backup file name
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
        const backupFile = path.join(BACKUP_DIR, `backup-${timestamp}.json`);

        console.log('🔄 Starting MongoDB backup...');
        console.log(`📍 Database: ${DATABASE_URL}`);
        console.log(`💾 Backup location: ${backupFile}`);

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

        // Save to file
        fs.writeFileSync(backupFile, JSON.stringify(backup, null, 2));
        
        const stats = fs.statSync(backupFile);
        const fileSizeKB = (stats.size / 1024).toFixed(2);
        
        console.log('\n✅ Backup completed successfully!');
        console.log(`📦 Backup saved to: ${backupFile}`);
        console.log(`💾 File size: ${fileSizeKB} KB`);

        // List all backups
        const backups = fs.readdirSync(BACKUP_DIR)
            .filter(f => f.startsWith('backup-') && f.endsWith('.json'))
            .sort()
            .reverse();

        console.log(`\n📋 Total backups: ${backups.length}`);
        console.log('Latest 5 backups:');
        backups.slice(0, 5).forEach((backup, index) => {
            const stats = fs.statSync(path.join(BACKUP_DIR, backup));
            const size = (stats.size / 1024).toFixed(2);
            console.log(`  ${index + 1}. ${backup} (${size} KB)`);
        });

        // Auto-cleanup: keep only last 10 backups
        if (backups.length > 10) {
            const toDelete = backups.slice(10);
            console.log(`\n🧹 Cleaning up ${toDelete.length} old backups...`);
            toDelete.forEach(backup => {
                const backupPath = path.join(BACKUP_DIR, backup);
                fs.unlinkSync(backupPath);
                console.log(`  Deleted: ${backup}`);
            });
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
