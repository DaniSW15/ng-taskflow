/** Modelo simple usado por TaskStateService (estado local) */
export interface Task {
    id: string;
    title: string;
    description: string;
    status: 'todo' | 'in-progress' | 'done';
}

/** Modelo completo de la API */
export interface TaskItem {
    id: string;
    title: string;
    description?: string;
    status: TaskItemStatus;
    priority: TaskPriority;
    dueDate?: string;
    boardId: string;
    assigneeId?: string;
    assigneeName?: string;
    tags?: import('./tag.models').Tag[];
    createdAt: string;
    updatedAt: string;
}

export enum TaskItemStatus {
    Todo = 'Todo',
    InProgress = 'InProgress',
    Done = 'Done',
    Cancelled = 'Cancelled'
}

export enum TaskPriority {
    Low = 'Low',
    Medium = 'Medium',
    High = 'High',
    Critical = 'Critical'
}
