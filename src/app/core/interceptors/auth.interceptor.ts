import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '@core/auth/auth.service';
import { Router } from '@angular/router';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const auth = inject(AuthService);
    const router = inject(Router);

    const token = auth.accessToken();
    const authReq = token
        ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
        : req;

    return next(authReq).pipe(
        catchError((error: HttpErrorResponse) => {
            if (error.status === 401) {
                return auth.refreshToken().pipe(
                    switchMap(() => {
                        const newToken = auth.accessToken();
                        const retried = req.clone({
                            setHeaders: { Authorization: `Bearer ${newToken}` }
                        });
                        return next(retried);
                    }),
                    catchError(() => {
                        router.navigate(['/login']);
                        return throwError(() => error);
                    })
                );
            }
            return throwError(() => error);
        })
    );
};
