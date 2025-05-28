import { inject, Injectable, signal, Signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Profile } from '../intefaces/profile.interface';
import { Pageble } from '../intefaces/pageble.interface';
import { map, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  http: HttpClient = inject(HttpClient);
  notmybackend = 'https://icherniakov.ru/yt-course/auth/'
  baseApiUrl = 'https://talk-backend-betatest.onrender.com/'
  me = signal<Profile | null>(null)

  constructor() { }


  //запрос на сервер для получения списка всех тестовых аккаунтов
  getTestAccounts() {
    return this.http.get<Profile[]>( `${this.notmybackend}account/test_accounts`)
  }

  //запрос на сервер для получения списка всех аккаунтов
  getAccount(id: string) {
    return this.http.get<Profile>(`${this.baseApiUrl}account/${id}`)
  }

  //запрос на сервер для получения своего аккаунта
  getMe() {
    return this.http.get<Profile>(`${this.baseApiUrl}account/me`)
    .pipe(
      tap(res => this.me.set(res))
    )
  }


  //запрос на сервер для получения списка подписчиков
  getSubscribersShortList(subsAmount = 3) {
    return this.http.get<Pageble<Profile>>(`${this.baseApiUrl}account/subscribers/`)
    .pipe(
      map( res => res.items.slice(0, subsAmount))
    )
  }

  followUser(userId: string) {
    return this.http.post(`${this.baseApiUrl}follow/${userId}`, {});
  }

  unfollowUser(userId: string)
  {
    return this.http.delete(`${this.baseApiUrl}unfollow/${userId}`,);
  }

  // checkIfSubscribed(userId: string) {
  //   return this.http.get<{subscribed: boolean}>(`${this.baseApiUrl}follow/${userId}`);
  // }

  // patchProfile(profile: Partial<Profile>) {
  //   return this.http.patch<Profile>(
  //     `${this.baseApiUrl}account/me`,
  //     profile
  //   )
  // }
}
