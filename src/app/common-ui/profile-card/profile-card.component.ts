import { NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Profile } from 'src/app/data/intefaces/profile.interface';

@Component({
  selector: 'app-profile-card',
  standalone: true,
  imports: [NgIf],

  
  templateUrl: './profile-card.component.html',
  styleUrls: ['./profile-card.component.scss']
})
export class ProfileCardComponent {
  @Input() profile!: Profile;
}
