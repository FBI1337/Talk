import { HttpHandlerFn, HttpInterceptorFn, HttpRequest } from "@angular/common/http";
import { inject } from "@angular/core";
import { AuthService } from "./auth.service";
import { catchError, switchMap, throwError, of } from "rxjs";
import { Router } from "@angular/router";

let isRefreshing = false


export const authTokenInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService);
    const token = authService.token;
    const router = inject(Router);

    if (!token) return next(req)


    if (isRefreshing) {
        return refreshAndProceed(authService, req, next)
    }

    return next(addToken(req, token))
    .pipe(
        catchError(error => {
            if (error.status === 403) {
                authService.logout();
                router.navigate(['/login']);
                return of(error);
            }

            return throwError(() => error)
        })
    )
}

const refreshAndProceed = (
    authService: AuthService,
    req: HttpRequest<any>,
    next: HttpHandlerFn
) => {
    if (!isRefreshing) {
        isRefreshing = true
        return authService.refreshAuthToken()
        .pipe(
            switchMap(res => {
                isRefreshing = false
                return next(addToken(req, res.access_token))
            }),
        )
    }

    return next(addToken(req, authService.token!))
}

const addToken = (req: HttpRequest<any>, token: string) => {
     return req = req.clone({
        setHeaders: {
            Authorization: `Bearer ${token}`
        }
    })
}