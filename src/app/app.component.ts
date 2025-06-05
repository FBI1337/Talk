import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ProfileService } from './data/services/profile.service';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet],
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit { 

  private profileService = inject(ProfileService);

  ngOnInit(): void {

    const userId = localStorage.getItem('userId')
    this.profileService.setActive(true).subscribe();

    window.addEventListener('beforeunload', () => {
      if (userId) this.profileService.sendInactiveOnUnload(userId);
    });

    setInterval(() => this.profileService.setActive(true).subscribe(), 30000)
  }


  constructor() {}

}
