import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProfileCardComponent } from 'src/app/common-ui/profile-card/profile-card.component';
import { Profile } from 'src/app/data/intefaces/profile.interface';
import { ProfileService } from 'src/app/data/services/profile.service';

@Component({
    selector: 'app-search-page',
    standalone: true,
    imports: [
      ProfileCardComponent,
      CommonModule,
      FormsModule
    ],
    templateUrl: './search-page.component.html',
    styleUrls: ['./search-page.component.scss']
})
export class SearchPageComponent {
  query = '';
  results: any[] = [];
  loading = false;
  error: string | null = null;

  constructor(private profileService: ProfileService) {}

  onSearch() {
    if (!this.query.trim()) return;
    this.loading = true;
    this.error = null;

    this.profileService.searchUsers(this.query).subscribe({
      next: data => {
        this.results = data;
        this.loading = false;
      },
      error: err => {
        this.error = 'Ошибка при поиске пользователей';
        this.loading = false;
      }
    });
  }
}
