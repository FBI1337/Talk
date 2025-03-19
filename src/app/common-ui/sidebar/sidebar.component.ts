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
    JsonPipe,
    ImgUrlPipe
],
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {

    profileService = inject(ProfileService)
    subscribers$ = this.profileService.getSubscribersShortList()

    me = this.profileService.me

    menuItems = [
        {
            label: 'Моя страницв',
            icon: 'home',
            link: ''
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
        firstValueFrom(this.profileService.getMe())        
    }
}
