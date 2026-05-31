import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap, catchError, EMPTY } from 'rxjs';
import { environment } from '@env/environment.production';

import { AuthResponse, LoginRequest, RegisterRequest, UserRole } from '@models/auth.models';

const ACCESS_TOKEN_KEY = 'tf_access_token';
const REFRESH_TOKEN_KEY = 'tf_refresh_token';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private readonly http = inject(HttpClient);
    private readonly router = inject(Router);
    private readonly baseUrl = `${environment.apiUrl}/Auth`;

    // --- Signals ---
    private readonly _user = signal<AuthResponse | null>(this.loadStoredUser());

    readonly user = this._user.asReadonly();
    readonly isAuthenticated = computed(() => this._user() !== null);
    readonly isAdmin = computed(() => this._user()?.role === UserRole.Admin);
    readonly isAnalyst = computed(() => this._user()?.role === UserRole.Analyst);
    readonly isAdminOrAnalyst = computed(() =>
        this._user()?.role === UserRole.Admin || this._user()?.role === UserRole.Analyst
    );
    readonly accessToken = computed(() => {
        this._user(); // re-evalúa cuando user cambia (login/logout)
        return localStorage.getItem(ACCESS_TOKEN_KEY);
    });

    // --- Auth actions ---

    register(request: RegisterRequest) {
        return this.http.post<{ data: AuthResponse }>(`${this.baseUrl}/register`, request).pipe(
            tap(res => this.handleAuthSuccess(res.data))
        );
    }

    login(request: LoginRequest) {
        return this.http.post<{ data: AuthResponse }>(`${this.baseUrl}/login`, request).pipe(
            tap(res => this.handleAuthSuccess(res.data))
        );
    }

    logout() {
        return this.http.post(`${this.baseUrl}/logout`, {}).pipe(
            tap(() => this.clearSession()),
            catchError(() => {
                this.clearSession();
                return EMPTY;
            })
        );
    }

    refreshToken() {
        const rt = localStorage.getItem(REFRESH_TOKEN_KEY);
        const at = localStorage.getItem(ACCESS_TOKEN_KEY);
        if (!rt || !at) return EMPTY;

        return this.http.post<{ data: AuthResponse }>(`${this.baseUrl}/refresh`, {
            accessToken: at,
            refreshToken: rt
        }).pipe(
            tap(res => this.handleAuthSuccess(res.data))
        );
    }

    getUserRole() {
        return this.user()?.role;
    }

    // --- Internal ---

    private handleAuthSuccess(auth: AuthResponse) {
        localStorage.setItem(ACCESS_TOKEN_KEY, auth.accessToken);
        localStorage.setItem(REFRESH_TOKEN_KEY, auth.refreshToken);
        this._user.set(auth);
    }

    private clearSession() {
        localStorage.removeItem(ACCESS_TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
        this._user.set(null);
        this.router.navigate(['/login']);
    }

    private loadStoredUser(): AuthResponse | null {
        const token = localStorage.getItem(ACCESS_TOKEN_KEY);
        if (!token) return null;

        try {
            // atob() no maneja UTF-8 — usar decodeURIComponent para caracteres acentuados
            const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
            const payload = JSON.parse(
                decodeURIComponent(
                    atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')
                )
            );
            const exp = payload.exp * 1000;
            if (Date.now() > exp) {
                localStorage.removeItem(ACCESS_TOKEN_KEY);
                localStorage.removeItem(REFRESH_TOKEN_KEY);
                return null;
            }

            return {
                accessToken: token,
                refreshToken: localStorage.getItem(REFRESH_TOKEN_KEY) ?? '',
                accessTokenExpiresAt: new Date(exp).toISOString(),
                userId: payload.sub ?? payload.nameid ?? '',
                email: payload.email ?? '',
                firstName: payload.given_name ?? '',
                lastName: payload.family_name ?? '',
                role: this.parseRole(
                    payload.role
                    ?? payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']
                )
            };
        } catch {
            return null;
        }
    }

    private parseRole(raw: unknown): UserRole {
        if (raw === undefined || raw === null) return UserRole.Member;
        const num = Number(raw);
        if (!isNaN(num)) return num as UserRole;
        // Fallback: string name from backend
        const nameMap: Record<string, UserRole> = {
            Member: UserRole.Member,
            Admin: UserRole.Admin,
            Analyst: UserRole.Analyst,
            Client: UserRole.Client,
        };
        return nameMap[String(raw)] ?? UserRole.Member;
    }
}
