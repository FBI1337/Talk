import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { SvgIconComponent } from 'src/app/common-ui/svg-icon/svg-icon.component';
import { ProfileService } from 'src/app/data/services/profile.service';
import { HightLightPipe } from 'src/app/helpers/pipes/hightlight.pipe';
import { TimeAgoPipe } from 'src/app/helpers/pipes/time-ago.pipe';

@Component({
  selector: 'app-tape-page',
  standalone: true,
  imports: [ CommonModule, TimeAgoPipe, RouterLink, FormsModule, HightLightPipe, SvgIconComponent ],
  templateUrl: './tape-page.component.html',
  styleUrl: './tape-page.component.scss'
})
export class TapePageComponent implements OnInit {


  posts: any[] = [];
  allPosts: any[] = []
  searchQuery: string = '';
  selectedTags: string[] = [];
  showFilters = false;
  tagInput: string = '';




  constructor(private profileService: ProfileService) {}


  ngOnInit(): void {
    this.profileService.getAllPost().subscribe({
      next: (data) => {
        this.posts = this.allPosts = data.filter(post => !post.onlyFollowers);
      },
      error: (err) => {
        console.error('Ошибка при загрузке всех постов: ',  err)
      }
    })
  }

  onSearch() {
    const query = this.searchQuery.toLowerCase().trim();

    this.posts = this.allPosts.filter(post => {
      const contentMatch = 
      post.content.toLowerCase().includes(query)

      const tagsMatch = this.selectedTags.every(tag => 
        post.tags.map((t: string) => t.toLowerCase().includes(tag.toLowerCase()))
      );

      return contentMatch && (this.selectedTags.length === 0 || tagsMatch)
    });
  }


  toggleFilters() {
    this.showFilters = !this.showFilters;
  }


  addTag(event: Event) {
    event.preventDefault();

    const keboardEvent = event as KeyboardEvent;
    const input = event.target as HTMLImageElement;
    const tag = this.tagInput.trim();

    if (tag && !this.selectedTags.includes(tag)) {
      this.selectedTags.push(tag); 
      this.tagInput = '';
      this.onSearch();
    }
  }

  removeTag(tag: string) {
    this.selectedTags = this.selectedTags.filter(t => t !== tag);
    this.onSearch();
  }

  onTagChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const tag = input.value;

    if (input.checked) {
      this.selectedTags.push(tag)
    } else {
      this.selectedTags = this.selectedTags.filter(t => t !== tag);
    }

    this.onSearch();
  }
}
