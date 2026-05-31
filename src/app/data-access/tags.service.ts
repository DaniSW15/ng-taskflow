import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';
import { ApiResponse } from '@models/board.models';
import { Tag } from '@models/tag.models';

@Injectable({ providedIn: 'root' })
export class TagsService {
    private readonly http = inject(HttpClient);
    private readonly baseUrl = `${environment.apiUrl}/Tags`;

    getTags() {
        return this.http.get<ApiResponse<Tag[]>>(this.baseUrl);
    }

    createTag(name: string, color = '#6366F1') {
        return this.http.post<ApiResponse<string>>(this.baseUrl, { name, color });
    }

    deleteTag(id: string) {
        return this.http.delete<ApiResponse<void>>(`${this.baseUrl}/${id}`);
    }
}
