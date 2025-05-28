import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { ProfileHeaderComponent } from "../../common-ui/profile-header/profile-header.component";
import { ProfileService } from 'src/app/data/services/profile.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { combineLatest, switchMap } from 'rxjs';
import { toObservable } from '@angular/core/rxjs-interop'; 
import { AsyncPipe, JsonPipe, NgForOf } from '@angular/common';
import { SvgIconComponent } from "../../common-ui/svg-icon/svg-icon.component";
import { ImgUrlPipe } from 'src/app/helpers/pipes/img-url.pipe';
import { PostFeedComponent } from './post-feed/post-feed.component';
import { map } from 'rxjs/operators';

@Component({
    selector: 'app-profile-page',
    standalone: true,
    imports: [
    ProfileHeaderComponent,
    AsyncPipe,
    SvgIconComponent,
    RouterLink,
    ImgUrlPipe,
    PostFeedComponent,
],
    templateUrl: './profile-page.component.html',
    styleUrls: ['./profile-page.component.scss'],
})
export class ProfilePageComponent {
    profileService = inject(ProfileService)
    route = inject(ActivatedRoute)

    me$ = toObservable(this.profileService.me)
    subscribers$ = this.profileService.getSubscribersShortList(5)

    isSubscribed = false;
    currentProfile: string | null = null;
    cdr = inject(ChangeDetectorRef);

    profile$ = this.route.params
    .pipe (
        switchMap(({ id }) => id === 'me'
        ? this.me$
        : this.profileService.getAccount(id)
        )
    )

    isOwnProfile$ = combineLatest([this.profile$, this.me$]).pipe(
        map(([profile, me]) => profile?.id === me?.id)
    );

    onSubscribe(userId: string) {
        if (this.isSubscribed || !userId) return;

        this.profileService.followUser(userId).subscribe({
            next: () => {
                console.log(`Подписка на пользователя ${userId} успешна`);

                this.isSubscribed = true;
                this.cdr.detectChanges();
            },
            error: (err) => {
                console.error('Ошибка подписки', err);
            }
        })
    }

}
