import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.model';
import { LoginDTO, LoginResponseDTO, UserDataDTO, UserResponseDTO } from '../dtos/user.dto';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production';
const JWT_EXPIRY = '24h';

export const hashPassword = async (password: string): Promise<string> => {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
};

export const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
    return bcrypt.compare(password, hashedPassword);
};

export const generateToken = (userId: string, username: string, role: string): string => {
    return jwt.sign(
        { userId, username, role },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRY }
    );
};

export const verifyToken = (token: string): any => {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        return null;
    }
};

export const login = async (loginData: LoginDTO): Promise<LoginResponseDTO> => {
    try {
        const { username, password } = loginData;

        // Find user
        const user = await User.findOne({ username });
        if (!user) {
            return { isSuccess: false, errorText: 'Invalid username or password' };
        }

        // Verify password
        const isValidPassword = await comparePassword(password, user.password);
        if (!isValidPassword) {
            return { isSuccess: false, errorText: 'Invalid username or password' };
        }

        // Generate token
        const token = generateToken(user._id.toString(), user.username, user.role);

        const userData: UserDataDTO = {
            id: user._id.toString(),
            username: user.username,
            email: user.email,
            role: user.role,
        };

        return {
            isSuccess: true,
            data: {
                token,
                user: userData,
            },
        };
    } catch (error) {
        console.error('[login] Error:', error);
        return { isSuccess: false, errorText: 'Login failed' };
    }
};

export const getUserById = async (userId: string): Promise<UserResponseDTO> => {
    try {
        const user = await User.findById(userId).select('-password');
        if (!user) {
            return { isSuccess: false, errorText: 'User not found' };
        }

        const userData: UserDataDTO = {
            id: user._id.toString(),
            username: user.username,
            email: user.email,
            role: user.role,
        };

        return { isSuccess: true, data: userData };
    } catch (error) {
        console.error('[getUserById] Error:', error);
        return { isSuccess: false, errorText: 'Failed to fetch user' };
    }
};
