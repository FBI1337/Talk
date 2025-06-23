import { AfterViewInit, Component, inject, ViewChild } from '@angular/core';
import { PostInputComponent } from '../post-input/post-input.component';
import { PostComponent } from '../post/post.component';
import { ActivatedRoute } from '@angular/router';
import { ProfileService } from 'src/app/data/services/profile.service';
import { combineLatest, map, switchMap } from 'rxjs';
import { toObservable } from '@angular/core/rxjs-interop';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-post-feed',
  standalone: true,
  imports: [
    PostInputComponent,
    PostComponent,
    AsyncPipe
  ],
  templateUrl: './post-feed.component.html',
  styleUrl: './post-feed.component.scss'
})
export class PostFeedComponent implements AfterViewInit {

  @ViewChild(PostComponent) postComponent!: PostComponent;

  profileService = inject(ProfileService)
  route = inject(ActivatedRoute)
  me$ = toObservable(this.profileService.me)
  
  profile$ = this.route.params
  .pipe (
    switchMap(({ id }) => id === 'me'
    ? this.me$
    : this.profileService.getAccount(id)
  ))

  ngAfterViewInit(): void {
    
  }

  onPostCreated() {
    const url = this.route.snapshot.paramMap.get('id');
    const userId = url === 'me' ? localStorage.getItem('userId') : url;

    if (userId) {
      this.postComponent.updatePosts(userId)
    }
  }
  
  isOwnProfile$ = combineLatest([this.profile$, this.me$]).pipe(
    map(([profile, me]) => profile?.id === me?.id)
  );
  
}
