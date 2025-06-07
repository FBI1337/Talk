import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
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
export class SearchPageComponent  implements OnInit{
  profileService = inject(ProfileService);
  profiles: Profile[] = []


  trackById(index: number, profile: Profile) {
    return profile.id;
  }

  ngOnInit(): void {

    const userId = localStorage.getItem('userId')
    this.profileService.setActive(true).subscribe();

    window.addEventListener('beforeunload', () => {
      if (userId) this.profileService.sendInactiveOnUnload(userId);
    });

    setInterval(() => this.profileService.setActive(true).subscribe(), 30000)
  }


  // constructor() {
  //   this.profileService.getTestAccounts()
  //   .subscribe(val => {
  //     this.profiles = val
  //   })
  // }
}
