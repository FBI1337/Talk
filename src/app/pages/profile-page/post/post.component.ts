import { Component, OnDestroy, OnInit } from '@angular/core';
import { SvgIconComponent } from 'src/app/common-ui/svg-icon/svg-icon.component';
import { CommentFeedComponent } from './comment-feed/comment-feed.component';
import { ProfileService } from 'src/app/data/services/profile.service';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { TimeAgoPipe } from 'src/app/helpers/pipes/time-ago.pipe';
import { AsyncPipe, CommonModule } from '@angular/common';
import { toObservable } from '@angular/core/rxjs-interop';
import { combineLatest, map, switchMap } from 'rxjs';


@Component({
  selector: 'app-post',
  standalone: true,
  imports: [ SvgIconComponent, CommentFeedComponent, TimeAgoPipe, CommonModule, AsyncPipe ],
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss'
})
export class PostComponent implements OnInit {

  posts: any[] = []
  noPost = false;
  activeCommentIndex: number | null = null;
  activeMenuIndex: number | null = null;
  me$ = toObservable(this.profileService.me)
  
  profile$ = this.route.params
  .pipe (
    switchMap(({ id }) => id === 'me'
    ? this.me$
    : this.profileService.getAccount(id)
  ))
  
  isOwnProfile$ = combineLatest([this.profile$, this.me$]).pipe(
    map(([profile, me]) => profile?.id === me?.id)
  );

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
  deletePost(postId: string) {
    if (!postId) return;

    this.profileService.deletePost(postId).subscribe({
      next: () => {
        const userId = localStorage.getItem('userId') || this.route.snapshot.paramMap.get('id')

        if (userId) this.fetchPosts(userId);
      },
      error: (err) => {
        console.error('Ошибка при удалении поста: ', err);
      }
    });

    this.activeMenuIndex = null;
  }

  toggleComments(index: number) {
    this.activeCommentIndex = this.activeCommentIndex === index ? null : index;
  }

  updatePosts(userId: string) {
    this.fetchPosts(userId)
  }

  toggleMenu(index: number) {
    this.activeMenuIndex = this.activeMenuIndex === index ? null : index;
  }

}
