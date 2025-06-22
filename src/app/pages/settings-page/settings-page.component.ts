import { Component, effect, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule,  Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { ProfileHeaderComponent } from 'src/app/common-ui/profile-header/profile-header.component';
import { SvgIconComponent } from 'src/app/common-ui/svg-icon/svg-icon.component';
import { firstValueFrom } from 'rxjs';
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
  authService = inject(AuthService)
  

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

  logout() {
    this.authService.logout();
  }

  onSave() {
    this.form.markAllAsTouched()
    this.form.updateValueAndValidity()

    if (this.form.invalid) return;


    const formValue = { ...this.form.value };

    const stackArray = formValue.stack
    ?.split(',')
    .map((skill: string) => skill.trim())
    .filter((skill: string) => skill.length > 0);


    //@ts-ignore
    firstValueFrom(this.profileService.patchProfile({...formValue, stack: stackArray }))
  }
}
