/**
 * MongoDB Restore Script for Development (No mongorestore required!)
 * Usage: npx ts-node scripts/restore-db.ts [backup-file-name]
 * Example: npx ts-node scripts/restore-db.ts backup-2025-12-29T10-30-00.json
 */

import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import * as fs from 'fs';
import * as path from 'path';



const DATABASE_URL = process.env.DATABASE_URL || 'mongodb://localhost:27017/videoprojectmanager';
const BACKUP_DIR = path.join(__dirname, '../backups');

async function restoreBackup() {
    try {
        // Get backup file name from command line argument
        const backupName = process.argv[2];

        if (!backupName) {
            console.log('❌ Please specify a backup file name');
            console.log('Usage: npx ts-node scripts/restore-db.ts [backup-file-name]');
            console.log('\nAvailable backups:');
            
            if (fs.existsSync(BACKUP_DIR)) {
                const backups = fs.readdirSync(BACKUP_DIR)
                    .filter(f => f.startsWith('backup-') && f.endsWith('.json'))
                    .sort()
                    .reverse();
                
                backups.forEach((backup, index) => {
                    const stats = fs.statSync(path.join(BACKUP_DIR, backup));
                    const size = (stats.size / 1024).toFixed(2);
                    console.log(`  ${index + 1}. ${backup} (${size} KB)`);
                });
            } else {
                console.log('  No backups found');
            }
            
            process.exit(1);
        }

        const backupFile = path.join(BACKUP_DIR, backupName);

        // Check if backup exists
        if (!fs.existsSync(backupFile)) {
            console.error(`❌ Backup not found: ${backupFile}`);
            process.exit(1);
        }

        console.log('🔄 Starting MongoDB restore...');
        console.log(`📍 Database: ${DATABASE_URL}`);
        console.log(`📦 Restoring from: ${backupFile}`);
        console.log('\n⚠️  WARNING: This will overwrite the current database!');
        
        // Read backup file
        const backupData = JSON.parse(fs.readFileSync(backupFile, 'utf-8'));
        
        console.log(`\n📊 Backup from: ${backupData.timestamp}`);
        console.log(`📚 Database: ${backupData.database}`);

        // Connect to MongoDB
        await mongoose.connect(DATABASE_URL);
        console.log('✅ Connected to MongoDB');

        const db = mongoose.connection.db;
        if (!db) throw new Error('Database connection failed');

        // Restore each collection
        const collectionNames = Object.keys(backupData.collections);
        console.log(`\n📦 Restoring ${collectionNames.length} collections...\n`);

        for (const collectionName of collectionNames) {
            const documents = backupData.collections[collectionName];
            
            console.log(`  📦 Restoring: ${collectionName}...`);
            
            // Drop existing collection
            try {
                await db.collection(collectionName).drop();
                console.log(`     🗑️  Dropped existing collection`);
            } catch (err) {
                // Collection might not exist, that's okay
            }

            // Insert documents
            if (documents.length > 0) {
                await db.collection(collectionName).insertMany(documents);
                console.log(`     ✓ Restored ${documents.length} documents`);
            } else {
                console.log(`     ℹ️  No documents to restore`);
            }
        }

        console.log('\n✅ Restore completed successfully!');
        
        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error('❌ Restore failed:', error);
        await mongoose.disconnect();
        process.exit(1);
    }
}

restoreBackup();
