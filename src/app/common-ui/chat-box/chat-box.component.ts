import { DatePipe, NgClass, NgFor, NgIf } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { io } from 'socket.io-client';
import { ProfileService } from 'src/app/data/services/profile.service';
import { SvgIconComponent } from '../svg-icon/svg-icon.component';

@Component({
  selector: 'app-chat-box',
  imports: [ FormsModule, NgClass, NgIf, NgFor, DatePipe, SvgIconComponent],
  standalone: true,
  templateUrl: './chat-box.component.html',
  styleUrl: './chat-box.component.scss'
})
export class ChatBoxComponent implements OnChanges{

  defaultAvatar: string = 'assets/imgs/avatar-placeholder.png';

  @Input() selectedUser: any; 
  currentUserId = localStorage.getItem('userId') ?? '';
  chatId = '';
  messages: any[] = [];
  newMessage = '';
  socket = io('https://talk-backend-betatest.onrender.com');

  constructor(private profileveService: ProfileService) {
    this.socket.on('receiveMessage', (msg) => {
      if (msg.chatId === this.chatId) {
        this.messages.push(msg);
      }
    })
  }


  ngOnChanges(): void {
    if (this.selectedUser) {
      this.startOrLoadChat();
    }
  }

  startOrLoadChat() {

    console.log('Создаю чат:', {
      senderId: this.currentUserId,
      receiverId: this.selectedUser?._id
    })
    this.profileveService
    .createOrGetChat(this.currentUserId, this.selectedUser._id)
    .subscribe((chat: any) => {
      this.chatId = chat._id;
      this.profileveService.getMessages(this.chatId).subscribe((msgs: any[]) => {
        this.messages = msgs;
      });
    });
  }

  sendMessage() {
    if (!this.newMessage.trim()) return;

    const msg = {
      chatId: this.chatId,
      senderId: this.currentUserId,
      text: this.newMessage,
    };

    this.profileveService.sendMessage(msg).subscribe((sentMsg: any) => {
      this.messages.push(sentMsg);
      this.socket.emit('sendMessage', sentMsg);
      this.newMessage = '';
    })
  }
}
