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

    private cdr = inject(ChangeDetectorRef);

    me$ = toObservable(this.profileService.me)
    subscribers$ = this.profileService.getSubscribersShortList(5)

    currentProfileId: string | null = null;
    isSubscribed = false;

    profile$ = this.route.params
    .pipe (
        switchMap(({ id }) => {
            this.currentProfileId = id;

            const profile$ = id === 'me' 
            ?  this.me$
            : this.profileService.getAccount(id);


            if (id !== 'me') {
                this.profileService.checkIfSubscribed(id).subscribe(res => {
                    this.isSubscribed = res.subscribed;
                    this.cdr.detectChanges();
                })
            }

            return profile$
        })
    )

    isOwnProfile$ = combineLatest([this.profile$, this.me$]).pipe(
        map(([profile, me]) => profile?.id === me?.id)
    );


    toggleFollow() {
        if (!this.currentProfileId || this.currentProfileId === 'me') return;

        const action$ = this.isSubscribed
        ? this.profileService.unfollowUser(this.currentProfileId)
        : this.profileService.followUser(this.currentProfileId);

        action$.subscribe(() => {
            this.isSubscribed = !this.isSubscribed;
            this.cdr.detectChanges();
        })
    }


}
