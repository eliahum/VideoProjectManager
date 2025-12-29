import mongoose, { Document } from 'mongoose';

export type UserRole = 'user' | 'admin';

// User Schema
const userSchema = new mongoose.Schema(
    {
        username: { type: String, required: true, unique: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true }, // hashed password
        role: { type: String, enum: ['user', 'admin'], default: 'user' },
    },
    { timestamps: true }
);

export interface UserDocument extends Document {
    username: string;
    email: string;
    password: string;
    role: UserRole;
    createdAt?: Date;
    updatedAt?: Date;
}

const User = mongoose.model<UserDocument>('User', userSchema);

export default User;
