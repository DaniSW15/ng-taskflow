import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '@env/environment.production';

import { ApiResponse, PaginatedList } from '@models/board.models';
import { Client } from '@models/client.models';

export interface ClientRequest {
    name: string;
    email: string;
    phone?: string;
    company?: string;
    notes?: string;
}

@Injectable({ providedIn: 'root' })
export class ClientsService {
    private readonly http = inject(HttpClient);
    private readonly baseUrl = `${environment.apiUrl}/Clients`;

    getClients(pageNumber = 1, pageSize = 20) {
        const params = new HttpParams()
            .set('pageNumber', pageNumber)
            .set('pageSize', pageSize);
        return this.http.get<ApiResponse<PaginatedList<Client>>>(this.baseUrl, { params });
    }

    getClientById(id: string) {
        return this.http.get<ApiResponse<Client>>(`${this.baseUrl}/${id}`);
    }

    createClient(request: ClientRequest) {
        return this.http.post<ApiResponse<string>>(this.baseUrl, request);
    }

    updateClient(id: string, request: ClientRequest) {
        return this.http.put<ApiResponse<void>>(`${this.baseUrl}/${id}`, request);
    }

    deleteClient(id: string) {
        return this.http.delete<ApiResponse<void>>(`${this.baseUrl}/${id}`);
    }
}
