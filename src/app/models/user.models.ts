import { UserRole } from './auth.models';

export interface User {
    id: string;
    firstName: string;
    lastName: string;
    fullName: string;
    email: string;
    role: UserRole;
    createdAt: string;
    updatedAt: string;
}
