import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { ProfileService } from 'src/app/data/services/profile.service';

@Component({
    selector: 'app-layout',
    standalone: true,
    imports: [
        RouterOutlet,
        SidebarComponent,
    ],
    templateUrl: './layout.component.html',
    styleUrls: ['./layout.component.scss']
})
export class LayoutComponent {
    profileService = inject(ProfileService)
}
