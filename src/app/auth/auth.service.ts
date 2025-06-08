import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, tap, throwError } from 'rxjs';
import { TokenResponse } from './auth.interface';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { ProfileService } from '../data/services/profile.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  http = inject(HttpClient)
  router = inject(Router)
  profileService = inject(ProfileService)
  cookieService = inject(CookieService)
  notmybackend = 'https://icherniakov.ru/yt-course/auth/'
  baseApiUrl = 'https://talk-backend-betatest.onrender.com/'

  token: string | null = null;
  refreshToken: string | null = null;

  constructor() {
    this.initAutoRefresh();
  }

  get isAuth() {
    if (!this.token) {
      this.token = this.cookieService.get('token')
      this.refreshToken = this.cookieService.get('refreshToken')
    }
    return !!this.token;
  }

  login(payload: { username: string, password: string, rememberMe: boolean}) {
    const fd = new FormData();

    fd.append('username', payload.username)
    fd.append('password', payload.password)

    return this.http.post<TokenResponse>(
      `${this.baseApiUrl}auth/token`,
      fd,
    ).pipe(
      tap(val => this.saveTokens(val, payload.rememberMe)),
    )
  }

  register(payload: { username: string, firstName: string, lastName: string, email:string, password: string, city: string}) {
    const fd = new FormData();


    fd.append('firstName', payload.firstName)
    fd.append('lastName', payload.lastName)
    fd.append('username', payload.username)
    fd.append('email', payload.email)
    fd.append('password', payload.password)
    fd.append('city', payload.city)

    return this.http.post<TokenResponse>(
      `${this.baseApiUrl}auth/register`,
      fd,
    ).pipe(
      tap(val => this.saveTokens(val))
    )
  }

  verifyResetToken(token: string) {
    return this.http.get(`${this.baseApiUrl}auth/reset-password/${token}`);
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

  requestPasswordReset(email: string){
    return this.http.post(`${this.baseApiUrl}auth/forgot-password`, { email });
  }

  resetPassword(token: string, newPassword: string) {
    return this.http.post(`${this.baseApiUrl}auth/reset-password`, {
      token,
      newPassword,
    })
  }

  logout() {
    this.cookieService.deleteAll()
    localStorage.clear(); 
    this.token = null;
    this.refreshToken = null;
    this.router.navigate(['/login'])
    this.profileService.setActive(false).subscribe()
  }


  saveTokens(res: TokenResponse, rememberMe?: boolean){
    this.token = res.access_token;
    this.refreshToken = res.refresh_token;


    if (rememberMe) {
      console.log('long token', this.token)
      console.log('long refreshToken', this.refreshToken)
      this.cookieService.set('token', this.token, 7);
      this.cookieService.set('refreshToken', this.refreshToken, 7);
    } else {
      this.cookieService.set('token', this.token);
      this.cookieService.set('refreshToken', this.refreshToken);
    }

    
    localStorage.setItem('userId', res.userId)
  }


  private initAutoRefresh() {
    this.isAuth;
    if (this.refreshToken) {
      setInterval(() => {
        this.refreshAuthToken().subscribe({
          next: () => {
            console.log('Access token обновлен автоматически');
          },
          error: () => {
            console.warn('Не удалось обновить токен. Разлогиниваем пользователя')
            this.logout();
          }
        });
      }, 15 * 60 * 1000)
    }
  }
}
