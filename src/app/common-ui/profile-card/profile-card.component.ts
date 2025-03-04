import { CommonModule, NgIf } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { Profile } from 'src/app/data/intefaces/profile.interface';
import { ProfileService } from 'src/app/data/services/profile.service';
import { ImgUrlPipe } from 'src/app/helpers/pipes/img-url.pipe';

@Component({
  selector: 'app-profile-card',
  standalone: true,
  imports: [NgIf, CommonModule, ImgUrlPipe],

  
  templateUrl: './profile-card.component.html',
  styleUrls: ['./profile-card.component.scss']
})
export class ProfileCardComponent {
  @Input() profile!: Profile;

  trackBySkill(index: number, skill: string): string {
    return skill;
  }

}
