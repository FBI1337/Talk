import { Component, inject } from '@angular/core';
import { SvgIconComponent } from '../svg-icon/svg-icon.component';
import { AsyncPipe, JsonPipe, NgForOf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ImgUrlPipe } from 'src/app/helpers/pipes/img-url.pipe';
import { SubscriberCardComponent } from "./subscriber-card/subscriber-card.component";
import { ProfileService } from 'src/app/data/services/profile.service';
import { firstValueFrom } from 'rxjs';

@Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [
    SvgIconComponent,
    NgForOf,
    RouterLink,
    SubscriberCardComponent,
    AsyncPipe,
    ImgUrlPipe
],
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {

    profileService = inject(ProfileService)
    subscribers$ = this.profileService.getSubscribersShortList()

    me = this.profileService.me

    adminRoutes: { label: string, icom: string, link: string }[] = [];

    menuItems = [
        {
            label: 'Моя страница',
            icon: 'home',
            link: '/profile/me'
        },
        {
            label: 'Чаты',
            icon: 'chats',
            link: 'chats'
        },
        {
            label: 'Поиск',
            icon: 'search',
            link: 'search'
        }

    ]

    ngOnInit() {
        this.profileService.getMe().subscribe(profile => {
            if (profile.role === 'admin1') {
                this.adminRoutes = [
                    { label: 'Пользователи', icon: 'users', link: '/admin/users' }
                ];
            } else if (profile.role === 'admin2') {
                this.adminRoutes = [
                    { label: 'Пользователи', icon: 'users', link: '/admin/users' },
                    { label: 'Логи', icon: 'logs', link: '/admin/logs' },
                    { label: 'База данных', icon: 'database', link: '/admin/database'}
                ];
            }
        });
    }
}
