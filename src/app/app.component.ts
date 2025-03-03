import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ProfileService } from './data/services/profile.service';
import { ProfileCardComponent } from './common-ui/profile-card/profile-card.component';
import { CommonModule } from '@angular/common';
import { Profile } from './data/intefaces/profile.interface';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ProfileCardComponent, CommonModule],



  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent { 
  profileService = inject(ProfileService);
  profiles: Profile[] = []

  trackById(index: number, profile: Profile) {
    return profile.id;
  }

  constructor() {
    this.profileService.getTestAccounts()
    .subscribe(val => {
      this.profiles = val
    })
}

}
