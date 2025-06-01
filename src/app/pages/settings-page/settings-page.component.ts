import { Component, effect, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule,  Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ProfileHeaderComponent } from 'src/app/common-ui/profile-header/profile-header.component';
import { SvgIconComponent } from 'src/app/common-ui/svg-icon/svg-icon.component';
import { ProfileService } from 'src/app/data/services/profile.service';

@Component({
  selector: 'app-settings-page',
  imports: [
    ProfileHeaderComponent,
    ReactiveFormsModule,
    SvgIconComponent,
    RouterLink,
  ],
  templateUrl: './settings-page.component.html',
  styleUrl: './settings-page.component.scss'
})
export class SettingsPageComponent {

  fb = inject(FormBuilder);
  profileService = inject(ProfileService)

  form = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    username: [{value: '', disable: true }, Validators.required],
    description: [''],
    stack: ['']
  })

  constructor() {
    effect(() => {
      //@ts-ignore
      this.form.patchValue(this.profileService.me())
    })
  }

  onSave() {

  }
}
