import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AdminUser } from '../intefaces/adminUser.interface';


@Injectable({
    providedIn: 'root'
})
export class AdminService {
    private http = inject(HttpClient); 
    private baseApiUrl = 'https://talk-backend-betatest.onrender.com/';

    getAllUsers(): Observable<AdminUser[]> {
        return this.http.get<AdminUser[]>(`${this.baseApiUrl}admin/users`);
    }

    freezeUser(id: string, frozenUntil: Date): Observable<any> {
        return this.http.post(`${this.baseApiUrl}admin/freeze/${id}`, { frozenUntil });
    }

    unfreezeUser(id: string): Observable<any> {
        return this.http.post(`${this.baseApiUrl}admin/unfreeze/${id}`, {});
    }

    banUser(id: string): Observable<any> {
        return this.http.post(`${this.baseApiUrl}admin/ban/${id}`, {});
    }

    unbanUser(id: string): Observable<any> {
        return this.http.post(`${this.baseApiUrl}admin/unban/${id}`, {});
    }
}

