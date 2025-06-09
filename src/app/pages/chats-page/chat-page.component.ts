import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ChatBoxComponent } from 'src/app/common-ui/chat-box/chat-box.component';
import { UserListComponent } from 'src/app/common-ui/users-list/user-list.component';

@Component({
  selector: 'app-chat-page',
  standalone: true,
  imports: [CommonModule, UserListComponent, ChatBoxComponent],
  templateUrl: './chat-page.component.html',
  styleUrl: './chat-page.component.scss'
})
export class ChatPageComponent {

  selectedUser: any = null;

  onUserSelected(user: any) {
    this.selectedUser = user;
  }
}
