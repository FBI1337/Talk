import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProfileCardComponent } from 'src/app/common-ui/profile-card/profile-card.component';
import { SvgIconComponent } from 'src/app/common-ui/svg-icon/svg-icon.component';
import { Profile } from 'src/app/data/intefaces/profile.interface';
import { ProfileService } from 'src/app/data/services/profile.service';

@Component({
    selector: 'app-search-page',
    standalone: true,
    imports: [
      CommonModule,
      FormsModule,
      SvgIconComponent,
    ],
    templateUrl: './search-page.component.html',
    styleUrls: ['./search-page.component.scss']
})
export class SearchPageComponent implements OnInit{
  query = '';
  city = '';
  skillInput = '';
  selectedSkills: string[] = [];

  results: any[] = [];
  loading = false;
  error: string | null = null;
  showFilters = false;
  allUsers: Profile [] = [];

  constructor(private profileService: ProfileService) {}

  onSearch() {

    this.loading = true;
    this.error = null;

    const userId = localStorage.getItem('userId');

    if (!userId) {
      this.error = 'Ошибка: пользователь не найден';
      return;
    }

    this.profileService.searchUsers(this.query, this.city, this.selectedSkills).subscribe({
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

  toggleFilters() {
    this.showFilters = !this.showFilters;
  }


  addSkill(event: Event) {
    event.preventDefault();

    const input = this.skillInput.trim()
    if (!input) return;

    const tags = input
    .split(',')
    .map(tag => tag.trim())
    .filter(tag => tag.length > 0 && !this.selectedSkills.includes(tag));

    this.selectedSkills.push(...tags)
    this.skillInput = '';
  }

  removeSkill(tag: string) {
    this.selectedSkills = this.selectedSkills.filter(t => t !== tag)
  }



  ngOnInit(): void {
    this.onSearch();
  }
}
