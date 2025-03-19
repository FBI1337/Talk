import { Component, input } from '@angular/core';
import { Profile } from 'src/app/data/intefaces/profile.interface';
import { ImgUrlPipe } from 'src/app/helpers/pipes/img-url.pipe';

@Component({
  selector: 'app-profile-header',
  standalone: true,
  imports: [
    ImgUrlPipe,
  ],
  templateUrl: './profile-header.component.html',
  styleUrl: './profile-header.component.scss'
})
export class ProfileHeaderComponent {
  profile = input<Profile>()
}
