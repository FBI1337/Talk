import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProfileService } from 'src/app/data/services/profile.service';
import { TimeAgoPipe } from 'src/app/helpers/pipes/time-ago.pipe';

@Component({
  selector: 'app-tape-page',
  imports: [ CommonModule, TimeAgoPipe, RouterLink ],
  templateUrl: './tape-page.component.html',
  styleUrl: './tape-page.component.scss'
})
export class TapePageComponent implements OnInit {
  posts: any[] = [];
  allPosts: any[] = []
  searchQuery: string = '';

  constructor(private profileService: ProfileService) {}


  ngOnInit(): void {
    this.profileService.getAllPost().subscribe({
      next: (data) => {
        this.posts = this.allPosts = data;
      },
      error: (err) => {
        console.error('Ошибка при загрузке всех постов: ',  err)
      }
    })
  }

  onSearch() {
    const query = this.searchQuery.toLowerCase().trim();

    this.posts = this.allPosts.filter(post => 
      post.content.toLowerCase().includes(query) ||
      post.userId.firstName.toLowerCase().includes(query) ||
      post.userId.lastName.toLowerCase().includes(query)
    );
  }
}
