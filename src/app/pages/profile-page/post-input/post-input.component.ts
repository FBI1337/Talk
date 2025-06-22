import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SvgIconComponent } from 'src/app/common-ui/svg-icon/svg-icon.component';
import { Profile } from 'src/app/data/intefaces/profile.interface';
import { ProfileService } from 'src/app/data/services/profile.service';
import { ImgUrlPipe } from 'src/app/helpers/pipes/img-url.pipe';

@Component({
  selector: 'app-post-input',
  standalone: true,
  imports: [
    CommonModule,
    SvgIconComponent,
    FormsModule
  ],
  templateUrl: './post-input.component.html',
  styleUrl: './post-input.component.scss'
})
export class PostInputComponent {
  postText: string = '';
  postTags: string = '';
  onlyFollowers: boolean = false;

  constructor( private profileService: ProfileService) {}

  submitPost() {
    const content = this.postText.trim();
    const userId = localStorage.getItem('userId');
    const tags = this.postTags.split(',').map(t => t.trim()).filter(t => t)

    if (!content || !userId) return;

    this.profileService.creatPost({content, userId, onlyFollowers: this.onlyFollowers, tags}).subscribe({
      next: () => {
        this.postText = '';
        this.postTags = '';
        this.onlyFollowers = false;
      },
      error: (err) => {
        console.error('Ошибка при отправке поста:', err);
      }
    })
  }
}
