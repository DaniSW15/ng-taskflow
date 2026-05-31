import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '@core/auth/auth.service';
import { UserRole } from '@models/auth.models';

export const roleGuard = (allowedRoles: UserRole[]): CanActivateFn => {
    return () => {
        const authService = inject(AuthService);
        const router = inject(Router);
        const userRole = authService.getUserRole();

        if (authService.isAuthenticated() && userRole !== undefined && allowedRoles.includes(userRole)) {
            return true;
        }

        return router.parseUrl('/unauthorized');
    };
};
