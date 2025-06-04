import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ProfileCardComponent } from 'src/app/common-ui/profile-card/profile-card.component';
import { Profile } from 'src/app/data/intefaces/profile.interface';
import { ProfileService } from 'src/app/data/services/profile.service';

@Component({
    selector: 'app-search-page',
    standalone: true,
    imports: [
      ProfileCardComponent,
      CommonModule
    ],
    templateUrl: './search-page.component.html',
    styleUrls: ['./search-page.component.scss']
})
export class SearchPageComponent {
  profileService = inject(ProfileService);
  profiles: Profile[] = []


  trackById(index: number, profile: Profile) {
    return profile.id;
  }

  // constructor() {
  //   this.profileService.getTestAccounts()
  //   .subscribe(val => {
  //     this.profiles = val
  //   })
  // }
}
