import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs';
import { environment } from '@env/environment.production';

import { ApiResponse, CursorPaginatedList, PaginatedList } from '@models/board.models';
import { TaskItem, TaskItemStatus, TaskPriority } from '@models/task.models';
import { Comment } from '@models/comment.models';

export interface CreateTaskRequest {
    title: string;
    description?: string;
    priority: TaskPriority;
    dueDate?: string;
    assigneeId?: string;
}

export interface UpdateTaskRequest {
    title: string;
    description?: string;
    status: TaskItemStatus;
    priority: TaskPriority;
    dueDate?: string;
    assigneeId?: string;
}

const PRIORITY_NUM: Record<TaskPriority, number> = {
    [TaskPriority.Low]: 0,
    [TaskPriority.Medium]: 1,
    [TaskPriority.High]: 2,
    [TaskPriority.Critical]: 3
};

const STATUS_NUM: Record<TaskItemStatus, number> = {
    [TaskItemStatus.Todo]: 0,
    [TaskItemStatus.InProgress]: 1,
    [TaskItemStatus.Done]: 2,
    [TaskItemStatus.Cancelled]: 3
};

const NUM_PRIORITY: Record<number, TaskPriority> = {
    0: TaskPriority.Low,
    1: TaskPriority.Medium,
    2: TaskPriority.High,
    3: TaskPriority.Critical
};

const NUM_STATUS: Record<number, TaskItemStatus> = {
    0: TaskItemStatus.Todo,
    1: TaskItemStatus.InProgress,
    2: TaskItemStatus.Done,
    3: TaskItemStatus.Cancelled
};

@Injectable({ providedIn: 'root' })
export class TasksService {
    private readonly http = inject(HttpClient);
    private readonly baseUrl = `${environment.apiUrl}/Tasks`;

    getTasksByBoard(boardId: string, pageNumber = 1, pageSize = 50) {
        const params = new HttpParams()
            .set('boardId', boardId)
            .set('pageNumber', pageNumber)
            .set('pageSize', pageSize);
        return this.http.get<ApiResponse<PaginatedList<any>>>(this.baseUrl, { params }).pipe(
            map(res => ({
                ...res,
                data: res.data ? { ...res.data, items: res.data.items.map((t: any) => this.mapTask(t)) } : res.data
            } as ApiResponse<PaginatedList<TaskItem>>))
        );
    }

    getTaskById(id: string) {
        return this.http.get<ApiResponse<any>>(`${this.baseUrl}/${id}`).pipe(
            map(res => ({ ...res, data: res.data ? this.mapTask(res.data) : res.data } as ApiResponse<TaskItem>))
        );
    }

    createTask(boardId: string, request: CreateTaskRequest) {
        const params = new HttpParams().set('boardId', boardId);
        const body = { ...request, priority: PRIORITY_NUM[request.priority] };
        return this.http.post<ApiResponse<string>>(this.baseUrl, body, { params });
    }

    updateTask(id: string, request: UpdateTaskRequest) {
        const body = {
            ...request,
            priority: PRIORITY_NUM[request.priority],
            status: STATUS_NUM[request.status]
        };
        return this.http.put<ApiResponse<void>>(`${this.baseUrl}/${id}`, body);
    }

    deleteTask(id: string) {
        return this.http.delete<ApiResponse<void>>(`${this.baseUrl}/${id}`);
    }

    getTasksByBoardWithCursor(boardId: string, pageSize = 20, cursor?: string) {
        let params = new HttpParams()
            .set('boardId', boardId)
            .set('pageSize', pageSize);
        if (cursor) params = params.set('cursor', cursor);
        return this.http.get<ApiResponse<CursorPaginatedList<TaskItem>>>(
            `${this.baseUrl}/cursor`, { params }
        );
    }

    getComments(taskId: string, pageNumber = 1, pageSize = 20) {
        const params = new HttpParams()
            .set('pageNumber', pageNumber)
            .set('pageSize', pageSize);
        return this.http.get<ApiResponse<PaginatedList<Comment>>>(
            `${this.baseUrl}/${taskId}/comments`, { params }
        );
    }

    addComment(taskId: string, content: string) {
        return this.http.post<ApiResponse<string>>(
            `${this.baseUrl}/${taskId}/comments`, { content }
        );
    }

    deleteComment(taskId: string, commentId: string) {
        return this.http.delete<ApiResponse<void>>(
            `${this.baseUrl}/${taskId}/comments/${commentId}`
        );
    }

    addTag(taskId: string, tagId: string) {
        return this.http.post<ApiResponse<void>>(
            `${this.baseUrl}/${taskId}/tags/${tagId}`, {}
        );
    }

    removeTag(taskId: string, tagId: string) {
        return this.http.delete<ApiResponse<void>>(
            `${this.baseUrl}/${taskId}/tags/${tagId}`
        );
    }

    private mapTask(raw: any): TaskItem {
        return {
            ...raw,
            priority: NUM_PRIORITY[raw.priority as number] ?? raw.priority,
            status: NUM_STATUS[raw.status as number] ?? raw.status
        };
    }
}
