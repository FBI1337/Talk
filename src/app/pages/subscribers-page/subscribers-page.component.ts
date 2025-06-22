import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Profile } from 'src/app/data/intefaces/profile.interface';
import { ProfileService } from 'src/app/data/services/profile.service';
import { ImgUrlPipe } from 'src/app/helpers/pipes/img-url.pipe';

@Component({
  selector: 'app-subscribers-page',
  standalone: true,
  imports: [ ImgUrlPipe, CommonModule],
  templateUrl: './subscribers-page.component.html',
  styleUrl: './subscribers-page.component.scss'
})
export class SubscribersPageComponent {

  subscribers: Profile[] = [];
  isLoading = true;
  error: string | null = null;

  constructor(private profileService: ProfileService) {}

  ngOnInit(): void {
    this.profileService.getMySubscribersShortList(10).subscribe({
      next: (data) => {
        this.subscribers = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Не удалось загрузить подписчиков';
        this.isLoading = false;
      },
    });
  }
}
