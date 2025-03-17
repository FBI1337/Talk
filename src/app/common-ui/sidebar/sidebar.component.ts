import { Component } from '@angular/core';
import { SvgIconComponent } from '../svg-icon/svg-icon.component';
import { NgForOf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ImgUrlPipe } from 'src/app/helpers/pipes/img-url.pipe';

@Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [
        SvgIconComponent,
        NgForOf,
        RouterLink,
        ImgUrlPipe
    ],
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
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
}
