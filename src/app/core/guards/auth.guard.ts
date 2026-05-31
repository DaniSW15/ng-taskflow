import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, catchError, of } from 'rxjs';
import { AuthService } from '@core/auth/auth.service';

function isTokenExpiringSoon(token: string): boolean {
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return (payload.exp * 1000) - Date.now() < 60_000; // menos de 1 minuto
    } catch {
        return false;
    }
}

export const authGuard: CanActivateFn = () => {
    const auth = inject(AuthService);
    const router = inject(Router);

    if (!auth.isAuthenticated()) {
        return router.createUrlTree(['/login']);
    }

    const token = auth.accessToken();
    if (token && isTokenExpiringSoon(token)) {
        return auth.refreshToken().pipe(
            map(() => true),
            catchError(() => of(router.createUrlTree(['/login'])))
        );
    }

    return true;
};
