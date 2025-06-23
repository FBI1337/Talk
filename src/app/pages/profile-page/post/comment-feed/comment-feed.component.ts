import { Component, Input, OnInit } from '@angular/core';
import { CommentInputComponent } from '../comment-input/comment-input.component';
import { CommentComponent } from '../comment/comment.component';
import { ProfileService } from 'src/app/data/services/profile.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-comment-feed',
  imports: [ CommentInputComponent, CommentComponent, CommonModule],
  templateUrl: './comment-feed.component.html',
  styleUrl: './comment-feed.component.scss'
})
export class CommentFeedComponent implements OnInit{
  @Input() postId!: string;
  comments: any[] = [];

  constructor(private profileService: ProfileService) {}

  ngOnInit(): void {
    this.refreshComments();
  }

  refreshComments() {
    this.profileService.getCommentsPost(this.postId).subscribe({
      next: (res) => {
        this.comments = res
      },
      error: (err) => {
        console.error('Ошибка при обновлении комментариев: ', err);
      }
    });
  }
  
}
