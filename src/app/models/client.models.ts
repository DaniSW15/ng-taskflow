export interface Client {
    id: string;
    name: string;
    email: string;
    phone?: string;
    company?: string;
    notes?: string;
    projectCount: number;
    createdAt: string;
    updatedAt: string;
}
