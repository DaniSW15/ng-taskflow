import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '@env/environment';
import { ApiResponse, PaginatedList } from '@models/board.models';
import { User } from '@models/user.models';
import { UserRole } from '@models/auth.models';

@Injectable({ providedIn: 'root' })
export class UsersService {
    private readonly http = inject(HttpClient);
    private readonly baseUrl = `${environment.apiUrl}/Users`;

    getUsers(pageNumber = 1, pageSize = 20) {
        const params = new HttpParams()
            .set('pageNumber', pageNumber)
            .set('pageSize', pageSize);
        return this.http.get<ApiResponse<PaginatedList<User>>>(this.baseUrl, { params });
    }

    getMe() {
        return this.http.get<ApiResponse<User>>(`${this.baseUrl}/me`);
    }

    updateMe(firstName: string, lastName: string) {
        return this.http.put<ApiResponse<void>>(`${this.baseUrl}/me`, { firstName, lastName });
    }

    getUserById(id: string) {
        return this.http.get<ApiResponse<User>>(`${this.baseUrl}/${id}`);
    }

    changeRole(id: string, role: UserRole) {
        return this.http.patch<ApiResponse<void>>(`${this.baseUrl}/${id}/role`, { role });
    }

    deleteUser(id: string) {
        return this.http.delete<ApiResponse<void>>(`${this.baseUrl}/${id}`);
    }
}
