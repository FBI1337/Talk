import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, tap, throwError } from 'rxjs';
import { TokenResponse } from './auth.interface';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  http = inject(HttpClient)
  router = inject(Router)
  cookieService = inject(CookieService)
  notmybackend = 'https://icherniakov.ru/yt-course/auth/'
  baseApiUrl = 'https://talk-backend-betatest.onrender.com/'

  token: string | null = null;
  refreshToken: string | null = null;

  get isAuth() {
    if (!this.token) {
      this.token = this.cookieService.get('token')
      this.refreshToken = this.cookieService.get('refreshToken')
    }
    return !!this.token;
  }

  login(payload: { username: string, password: string}) {
    const fd = new FormData();

    fd.append('username', payload.username)
    fd.append('password', payload.password)

    return this.http.post<TokenResponse>(
      `${this.baseApiUrl}auth/token`,
      fd,
    ).pipe(
      tap(val => this.saveTokens(val))
    )
  }

  register(payload: { username: string, firstName: string, lastName: string, email:string, password: string}) {
    const fd = new FormData();


    fd.append('firstName', payload.firstName)
    fd.append('lastName', payload.lastName)
    fd.append('username', payload.username)
    fd.append('email', payload.email)
    fd.append('password', payload.password)

    return this.http.post<TokenResponse>(
      `${this.baseApiUrl}auth/register`,
      fd,
    ).pipe(
      tap(val => this.saveTokens(val))
    )
  }

  refreshAuthToken() {
    return this.http.post<TokenResponse>(
      `${this.baseApiUrl}auth/refresh`,
      {
        refresh_token: this.refreshToken,
      }
    ).pipe(
      tap(val => this.saveTokens(val)),
      catchError(err => {
        this.logout()
        return throwError(err) 
      })
    )
  }

  logout() {
    this.cookieService.deleteAll()
    localStorage.clear; 
    this.token = null;
    this.refreshToken = null;
    this.router.navigate(['/login'])
  }


  saveTokens(res: TokenResponse){
    this.token = res.access_token;
    this.refreshToken = res.refresh_token;

    this.cookieService.set('token', this.token)
    this.cookieService.set('refreshToken', this.refreshToken)
    localStorage.setItem('userId', res.userId)
  }
}
