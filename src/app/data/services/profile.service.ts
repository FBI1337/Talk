import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Profile } from '../intefaces/profile.interface';
import { Pageble } from '../intefaces/pageble.interface';
import { map, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  http: HttpClient = inject(HttpClient);
  // notmybackend = 'https://icherniakov.ru/yt-course/auth/'
  baseApiUrl = 'https://talk-backend-betatest.onrender.com/'
  me = signal<Profile | null>(null)

  constructor() { }


  //запрос на сервер для получения списка всех тестовых аккаунтов
  getTestAccounts() {
    // return this.http.get<Profile[]>( `${this.notmybackend}account/test_accounts`)
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

  getChatUsers(currentUserId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseApiUrl}chats/${currentUserId}`);
  }


  createOrGetChat(senderId: string, reciverId: string): Observable<any> {
    return this.http.post<any>(`${this.baseApiUrl}chats/create-or-get`, {
      senderId,
      reciverId
    })
  }

  creatPost( postData: {content: string, userId: string, onlyFollowers?: boolean, tags?: string[]}): Observable<any>{
    return this.http.post(`${this.baseApiUrl}posts/create-post`, postData)
  }

  getPost(userId?: string): Observable<any[]> {
    const params: Record<string, string> = {};

    if (userId) {
      params['userId'] = userId;
    }
    return this.http.get<any[]>(`${this.baseApiUrl}posts/pulling-post`, { 
      params,
      responseType: 'json'
     })
  }

  getAllPost(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseApiUrl}posts/all`, {
      responseType: 'json'
    })
  }

  addComment(commentData: { postId: string; userId: string; content: string}) {
    return this.http.post(`${this.baseApiUrl}comments/create-comment`, commentData);
  }

  getCommentsPost(postId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseApiUrl}comments/by-post/${postId}`)
  }

  getMessages(chatId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseApiUrl}chats/messages/${chatId}`);
  }

  sendMessage(message: {
    chatId: string;
    senderId: string;
    text: string;
  }): Observable<any> {
    return this.http.post<any>(`${this.baseApiUrl}chats/messages`, message)
  }

  getFollowers(userId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseApiUrl}chats/${userId}/followers`);
  }
  

  searchUsers(query: string, city: string, stack: string[]): Observable<Profile[]>{

    const params: any = { q: query};
    const userId = localStorage.getItem('userId');


    if (city.trim()) params.city = city;
    if (stack.length > 0) params.stack = stack.join(',');
    if (userId) params.excludeUserId = userId;

    const queryString = new URLSearchParams(params).toString();
    return this.http.get<Profile[]>(`${this.baseApiUrl}search/users?${queryString}`)
  }

  getUserRole() {
    const user = this.me();
    return user ? user.role : null;
  }


  //запрос на сервер для получения списка подписчиков
  getSubscribersShortList(userId: string, subsAmount = 3) {

    return this.http.get<Pageble<Profile>>(`${this.baseApiUrl}account/subscribers`, {
      params: {
         userId
      }
    })
    .pipe(
      map( res => res.items.slice(0, subsAmount))
    )
  }

  getMySubscribersShortList(subsAmount = 3) {
    const userId = localStorage.getItem('userId') || '';
    return this.getSubscribersShortList(userId, subsAmount);
  }

  followUser(targetId: string) {
    const currentUserId = localStorage.getItem('userId');

    if (!currentUserId) {
      throw new Error('Пользователь не авторизован')
    }

    return this.http.post(`${this.baseApiUrl}follow/${targetId}`, {
      userId: currentUserId
    })
  }

  unfollowUser(targetId: string)
  {
    const currentUserId = localStorage.getItem('userId');

    if (!currentUserId)
    {
      throw new Error('Пользователь не авторизованн')
    }

    return this.http.post(`${this.baseApiUrl}unfollow/${targetId}`, 
      {
        userId: currentUserId
      }
    );
  }

  checkIfSubscribed(targetUserId: string, userId: string | undefined) {
    if (!userId) {
      throw new Error('userId is undefined');
    }

    return this.http.get<{ subscribed: boolean }>(
      `${this.baseApiUrl}follow/is-following/${targetUserId}`,
      {
        params: {userId: String(userId)}
      }
    )
  }

  patchProfile(profile: Partial<Profile>) {

    const userId = localStorage.getItem('userId');

    return this.http.patch<Profile>(
      `${this.baseApiUrl}account/me`,
      { ...profile, userId}
    )
  }

  setActive (isActive: boolean) {
    return this.http.post(`${this.baseApiUrl}account/active`, { isActive })
  }

  sendInactiveOnUnload(userId: string) {
    const blob = new Blob(
      [JSON.stringify({ isActive: false, userId})],
      { type: 'aplication/json' },
    );
    navigator.sendBeacon(`${this.baseApiUrl}account/active`, blob)
  }
}
