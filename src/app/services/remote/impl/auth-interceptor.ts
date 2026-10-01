import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, from, switchMap, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { AUTH_SERVICE_TOKEN } from '../auth.service';

export const authInterceptor: HttpInterceptorFn = (
    req: HttpRequest<unknown>,
    next: HttpHandlerFn) => {
    const authService = inject(AUTH_SERVICE_TOKEN);
    const router = inject(Router);

    // TODO pas de rediriger vers login-request si on est déjà sur login-request ou login-otp ??
    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            if (error.status === 401 && !req.url.includes('/refresh')) {
                return from(authService.refreshAsync()).pipe(
                    switchMap(() => next(req)),
                    catchError(() => {
                        router.navigate(['/login-request']);
                        return throwError(() => error);
                    })
                );
            }
            return throwError(() => error);
        })
    );
};