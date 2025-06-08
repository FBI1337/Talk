import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { ProfileService } from 'src/app/data/services/profile.service';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-layout',
    standalone: true,
    imports: [
        RouterOutlet,
        SidebarComponent,
        CommonModule
    ],
    templateUrl: './layout.component.html',
    styleUrls: ['./layout.component.scss']
})
export class LayoutComponent {
    isSidebarOpen = true;

    toggleSidebar() {
        this.isSidebarOpen = !this.isSidebarOpen;
    }
}