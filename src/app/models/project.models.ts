export interface Project {
    id: string;
    title: string;
    description?: string;
    status: ProjectStatus;
    startDate?: string;
    endDate?: string;
    clientId: string;
    clientName: string;
    analystId: string;
    analystFullName: string;
    boardCount: number;
    createdAt: string;
    updatedAt: string;
}

export enum ProjectStatus {
    Planning = 'Planning',
    Active = 'Active',
    OnHold = 'OnHold',
    Completed = 'Completed',
    Cancelled = 'Cancelled'
}
