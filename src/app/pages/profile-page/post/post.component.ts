import { Component, OnDestroy, OnInit } from '@angular/core';
import { SvgIconComponent } from 'src/app/common-ui/svg-icon/svg-icon.component';
import { CommentFeedComponent } from './comment-feed/comment-feed.component';
import { ProfileService } from 'src/app/data/services/profile.service';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { TimeAgoPipe } from 'src/app/helpers/pipes/time-ago.pipe';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [ SvgIconComponent, CommentFeedComponent, TimeAgoPipe, CommonModule ],
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss'
})
export class PostComponent implements OnInit {

  posts: any[] = []
  noPost = false;
  activeCommentIndex: number | null = null;

  constructor(
    private profileService: ProfileService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const url = this.router.url;
  
    if (url === '/profile/me') {
      const myId = localStorage.getItem('userId');
      if (myId) this.fetchPosts(myId);
    } else {
      const userId = this.route.snapshot.paramMap.get('id');
      if (userId) this.fetchPosts(userId);
    }
  }

  fetchPosts(userId: string) {
    this.profileService.getPost(userId).subscribe({
      next: (data) => {
        this.posts = data;
        this.noPost = data.length === 0;
        this.activeCommentIndex = null;
      }, 
      error: (err) => {
        console.error('Ошибка при загрузке постов: ', err)
      }
    })
  }

  toggleComments(index: number) {
    this.activeCommentIndex = this.activeCommentIndex === index ? null : index;
  }
}
