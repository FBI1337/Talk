import { Component } from '@angular/core';
import { ProfileHeaderComponent } from 'src/app/common-ui/profile-header/profile-header.component';

@Component({
  selector: 'app-settings-page',
  imports: [
    ProfileHeaderComponent,
  ],
  templateUrl: './settings-page.component.html',
  styleUrl: './settings-page.component.scss'
})
export class SettingsPageComponent {

}
