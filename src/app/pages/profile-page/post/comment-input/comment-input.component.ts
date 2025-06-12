import { NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SvgIconComponent } from 'src/app/common-ui/svg-icon/svg-icon.component';
import { ProfileService } from 'src/app/data/services/profile.service';

@Component({
  selector: 'app-comment-input',
  imports: [ SvgIconComponent, FormsModule ],
  templateUrl: './comment-input.component.html',
  styleUrl: './comment-input.component.scss'
})
export class CommentInputComponent {

  @Input() postId!: string;

  commentText: string = '';
  isSending: boolean = false;

  constructor(private profileService: ProfileService) {}

  sendComment() {
    if (!this.commentText.trim()) return;

    this.isSending = true;

    const userId = localStorage.getItem('userId');

    this.profileService.addComment({
      postId: this.postId,
      userId: userId!,
      content: this.commentText.trim()
    }).subscribe({
      next: () => {
        this.commentText = '';
        this.isSending = false;
      }, 
      error: (err) => {
        console.error('Ошибка при добавлении комментария: ', err);
        this.isSending = false;
      }
    })
  }
}
