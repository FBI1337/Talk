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

  baseApiUrl = 'https://icherniakov.ru/yt-course/'

  me = signal<Profile | null>(null)

  constructor() { }

  getTestAccounts() {
    return this.http.get<Profile[]>( `${this.baseApiUrl}account/test_accounts`)
  }

  getAccount(id: string) {
    return this.http.get<Profile>(`${this.baseApiUrl}account/${id}`)
  }

  getMe() {
    return this.http.get<Profile>(`${this.baseApiUrl}account/me`)
    .pipe(
      tap(res => this.me.set(res))
    )
  }

  getSubscribersShortList() {
    return this.http.get<Pageble<Profile>>(`${this.baseApiUrl}account/subscribers/`)
    .pipe(
      map( res => res.items.slice(0, 3))
    )
  }

  patchProfile(profile: Partial<Profile>) {
    return this.http.patch<Profile>(
      `${this.baseApiUrl}account/me`,
      profile
    )
  }
}
