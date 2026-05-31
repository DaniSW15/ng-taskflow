import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '@env/environment';
import { ApiResponse, PaginatedList } from '@models/board.models';
import { Project, ProjectStatus } from '@models/project.models';

export interface ProjectRequest {
    title: string;
    description?: string;
    status: ProjectStatus;
    startDate?: string;
    endDate?: string;
    clientId: string;
    analystId: string;
}

@Injectable({ providedIn: 'root' })
export class ProjectsService {
    private readonly http = inject(HttpClient);
    private readonly baseUrl = `${environment.apiUrl}/Projects`;

    getProjects(pageNumber = 1, pageSize = 20) {
        const params = new HttpParams()
            .set('pageNumber', pageNumber)
            .set('pageSize', pageSize);
        return this.http.get<ApiResponse<PaginatedList<Project>>>(this.baseUrl, { params });
    }

    getProjectById(id: string) {
        return this.http.get<ApiResponse<Project>>(`${this.baseUrl}/${id}`);
    }

    createProject(request: ProjectRequest) {
        return this.http.post<ApiResponse<string>>(this.baseUrl, request);
    }

    updateProject(id: string, request: ProjectRequest) {
        return this.http.put<ApiResponse<void>>(`${this.baseUrl}/${id}`, request);
    }

    deleteProject(id: string) {
        return this.http.delete<ApiResponse<void>>(`${this.baseUrl}/${id}`);
    }
}
