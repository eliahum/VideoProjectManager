import { UserRole } from '../models/user.model';
import { BaseResponseDTO } from './base-response.dto';

export interface LoginDTO {
    username: string;
    password: string;
}

export interface LoginResponseData {
    token: string;
    user: UserDataDTO;
}

export interface UserDataDTO {
    id: string;
    username: string;
    email: string;
    role: UserRole;
}

export interface LoginResponseDTO extends BaseResponseDTO {
    data?: LoginResponseData;
}

export interface UserResponseDTO extends BaseResponseDTO {
    data?: UserDataDTO;
}
