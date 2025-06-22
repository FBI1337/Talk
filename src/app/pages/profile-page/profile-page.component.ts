import { Component, inject, ChangeDetectorRef, OnInit } from '@angular/core';
import { ProfileHeaderComponent } from "../../common-ui/profile-header/profile-header.component";
import { ProfileService } from 'src/app/data/services/profile.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { combineLatest, switchMap } from 'rxjs';
import { toObservable } from '@angular/core/rxjs-interop'; 
import { AsyncPipe, CommonModule, JsonPipe, NgForOf } from '@angular/common';
import { SvgIconComponent } from "../../common-ui/svg-icon/svg-icon.component";
import { ImgUrlPipe } from 'src/app/helpers/pipes/img-url.pipe';
import { PostFeedComponent } from './post-feed/post-feed.component';
import { map } from 'rxjs/operators';
import { Profile } from 'src/app/data/intefaces/profile.interface';

@Component({
    selector: 'app-profile-page',
    standalone: true,
    imports: [
    ProfileHeaderComponent,
    AsyncPipe,
    SvgIconComponent,
    RouterLink,
    PostFeedComponent,
    CommonModule
],
    templateUrl: './profile-page.component.html',
    styleUrls: ['./profile-page.component.scss'],
})
export class ProfilePageComponent implements OnInit {
    profileService = inject(ProfileService)
    route = inject(ActivatedRoute)

    me$ = toObservable(this.profileService.me)
    
    isSubscribed = false;
    currentProfile: string | null = null;
    cdr = inject(ChangeDetectorRef);
    
    profile$ = this.route.params
    .pipe (
        switchMap(({ id }) => id === 'me'
        ? this.me$
        : this.profileService.getAccount(id)
    ),
    map((profile: Profile | null) => {
            if(!profile) return {} as Profile & { skillsArray: string[] };
            
            return {
                ...profile,
                skillsArray: profile.stack
            };
        })
    )
    subscribers$ = this.profile$.pipe(
        switchMap(profile => {
            if(!profile?.id) return []
            return this.profileService.getSubscribersShortList(String(profile.id), 5)
        })
    )
    
    isOwnProfile$ = combineLatest([this.profile$, this.me$]).pipe(
        map(([profile, me]) => profile?.id === me?.id)
    );
    
    onSubscribe(userId: string | undefined) {
        if (!userId) return;

        if (this.isSubscribed) {
            this.profileService.unfollowUser(userId).subscribe({
                next: () => {
                    this.isSubscribed = false;
                    this.cdr.detectChanges();
                },
                error: (err) => {
                    console.error('Ошибка отписки', err);
                }
            });
        } else {
            this.profileService.followUser(userId).subscribe({
                next: () => {
                    this.isSubscribed = true;
                    this.cdr.detectChanges();
                },
                error: (err) => {
                    console.error('Ошибка подписки', err);
                }
            })
        }

    }

    ngOnInit(): void {
        combineLatest([this.route.params, this.me$])
        .pipe(
        switchMap(([params, me]) => {
            const targetId = params['id'] === 'me' ? me?.id : params['id'];
            this.currentProfile = targetId;

            if (!targetId || !me?.id || targetId === me.id) {
                this.isSubscribed = false;
                this.cdr.detectChanges();
                return [];
            }

            return this.profileService.checkIfSubscribed(targetId, me.id.toString());
        })
        )
        .subscribe ({
            next: (res) => {
                this.isSubscribed = res?.subscribed ?? false;
                this.cdr.detectChanges();
            },
            error: (err) => {
                console.error('Ошибка при проверке подписки', err);
            }
        });
    }

}
