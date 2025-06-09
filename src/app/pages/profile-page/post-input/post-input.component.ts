import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { SvgIconComponent } from 'src/app/common-ui/svg-icon/svg-icon.component';
import { Profile } from 'src/app/data/intefaces/profile.interface';
import { ImgUrlPipe } from 'src/app/helpers/pipes/img-url.pipe';

@Component({
  selector: 'app-post-input',
  standalone: true,
  imports: [
    CommonModule,
    ImgUrlPipe,
    SvgIconComponent
  ],
  templateUrl: './post-input.component.html',
  styleUrl: './post-input.component.scss'
})
export class PostInputComponent {

}
