import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '@env/environment';
import { ApiResponse, Board, PaginatedList } from '@models/board.models';

@Injectable({ providedIn: 'root' })
export class BoardsService {
    private readonly http = inject(HttpClient);
    private readonly baseUrl = `${environment.apiUrl}/Boards`;

    getBoards(pageNumber = 1, pageSize = 20) {
        const params = new HttpParams()
            .set('pageNumber', pageNumber)
            .set('pageSize', pageSize);
        return this.http.get<ApiResponse<PaginatedList<Board>>>(this.baseUrl, { params });
    }

    getBoardById(id: string) {
        return this.http.get<ApiResponse<Board>>(`${this.baseUrl}/${id}`);
    }

    createBoard(title: string, description?: string) {
        return this.http.post<ApiResponse<string>>(this.baseUrl, { title, description });
    }

    updateBoard(id: string, title: string, description?: string) {
        return this.http.put<ApiResponse<void>>(`${this.baseUrl}/${id}`, { title, description });
    }

    deleteBoard(id: string) {
        return this.http.delete<ApiResponse<void>>(`${this.baseUrl}/${id}`);
    }
}
