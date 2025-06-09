import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ProfileService } from 'src/app/data/services/profile.service';

@Component({
  selector: 'app-user-list',
  standalone: true, 
  imports: [ CommonModule],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})
export class UserListComponent implements OnInit{
  users: any[] = [];
  currentUserId: string | null = null;

  @Output() userSelected = new EventEmitter<any>();


  constructor(private profileservice: ProfileService) {}

  ngOnInit(): void {

    this.currentUserId = localStorage.getItem('userId');
    if (this.currentUserId) {
      this.profileservice.getSubscribersShortList(3).subscribe({
        next: (res) => {
          this.users = res;
        },
        error: (err) => {
          console.error('Ошибка загрузки подписчиков:', err);
        }
      });
    }
  }

  // loadUsers() {
  //   this.profileservice.getChatUsers(this.currentUserId!).subscribe((chats: any[]) => {
  //     const chatUsers = chats.map(chat => 
  //       chat.participants.find((p: any) => p._id !== this.currentUserId)
  //     );

  //     if (this.users.length > 0) {
  //       this.users = chatUsers;
  //     } else {
  //       this.profileservice.getFollowers(this.currentUserId!).subscribe((followers: any[]) => {
  //         this.users = followers;
  //       })
  //     }
  //   })
  // }

  onSelectUser(user: any) {
    this.userSelected.emit(user);
  }
}
