import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../services/authService';
import { UserRole } from '../models/user.model';

export interface AuthRequest extends Request {
    user?: {
        userId: string;
        username: string;
        role: UserRole;
    };
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ 
                isSuccess: false, 
                errorText: 'No token provided' 
            });
        }

        const token = authHeader.substring(7); // Remove 'Bearer ' prefix
        const decoded = verifyToken(token);

        if (!decoded) {
            return res.status(401).json({ 
                isSuccess: false, 
                errorText: 'Invalid or expired token' 
            });
        }

        req.user = {
            userId: decoded.userId,
            username: decoded.username,
            role: decoded.role,
        };

        next();
    } catch (error) {
        console.error('[authenticate] Error:', error);
        return res.status(401).json({ 
            isSuccess: false, 
            errorText: 'Authentication failed' 
        });
    }
};

export const authorize = (...allowedRoles: UserRole[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        if (!req.user) {
            return res.status(401).json({ 
                isSuccess: false, 
                errorText: 'Unauthorized' 
            });
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ 
                isSuccess: false, 
                errorText: 'Forbidden: Insufficient permissions' 
            });
        }

        next();
    };
};
