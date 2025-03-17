import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Profile } from '../intefaces/profile.interface';
import { Pageble } from '../intefaces/pageble.interface';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  http: HttpClient = inject(HttpClient);

  baseApiUrl = 'https://icherniakov.ru/yt-course/'

  constructor() { }

  getTestAccounts() {
    return this.http.get<Profile[]>( `${this.baseApiUrl}account/test_accounts`)
  }

  getMe() {
    return this.http.get<Profile>(`${this.baseApiUrl}account/me`)
    // .pipe(
    //   tap(res => this.me.set(res))
    // )
  }

  getSubscribersShortList() {
    return this.http.get<Pageble<Profile>>(`${this.baseApiUrl}account/subscribers`)
  }

  patchProfile(profile: Partial<Profile>) {
    return this.http.patch<Profile>(
      `${this.baseApiUrl}account/me`,
      profile
    )
  }
}
