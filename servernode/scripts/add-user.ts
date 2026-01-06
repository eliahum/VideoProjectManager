/**
 * Script to add users manually to the database
 * Usage: ts-node servernode/scripts/add-user.ts
 */

import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import User, { UserRole } from '../models/user.model';
import { hashPassword } from '../services/authService';

const DATABASE_URL = process.env.DATABASE_URL || 'mongodb://localhost:27017/videoprojectmanager';


interface UserData {
    username: string;
    email: string;
    password: string;
    role: UserRole;
}

const usersToAdd: UserData[] = [
    {
        username: 'user',
        email: 'user@videoprojectmanager.com',
        password: 'user',
        role: 'user'
    },
    {
        username: 'admin',
        email: 'admin@videoprojectmanager.com',
        password: 'admin',
        role: 'admin'
    },
    {
        username: 'superadmin',
        email: 'superadmin@videoprojectmanager.com',
        password: 'superadmin',
        role: 'superadmin'
    }
];

async function addUsers() {
    try {
        // Connect to MongoDB
        await mongoose.connect(DATABASE_URL);
        console.log('Connected to MongoDB');

        for (const userData of usersToAdd) {
            // Check if user already exists
            const existingUser = await User.findOne({ 
                $or: [
                    { username: userData.username },
                    { email: userData.email }
                ]
            });

            if (existingUser) {
                console.log(`⚠️  User '${userData.username}' already exists. Skipping...`);
                continue;
            }

            // Hash password
            const hashedPassword = await hashPassword(userData.password);

            // Create user
            const user = new User({
                username: userData.username,
                email: userData.email,
                password: hashedPassword,
                role: userData.role
            });

            await user.save();
            console.log(`✅ User '${userData.username}' created successfully (${userData.role})`);
        }

        console.log('\n🎉 All users processed!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error adding users:', error);
        process.exit(1);
    }
}

addUsers();
