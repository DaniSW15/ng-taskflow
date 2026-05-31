export enum UserRole {
    Member = 0,
    Admin = 1,
    Analyst = 2,
    Client = 3
}

export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    accessTokenExpiresAt: string;
    userId: string;
    email: string;
    firstName: string;
    lastName: string;
    role: UserRole;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}
