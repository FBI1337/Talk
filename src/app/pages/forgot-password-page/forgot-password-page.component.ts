import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-forgot-password-page',
  standalone: true,
  imports: [ CommonModule, ReactiveFormsModule],
  templateUrl: './forgot-password-page.component.html',
  styleUrl: './forgot-password-page.component.scss'
})
export class ForgotPasswordPageComponent {
  authService = inject(AuthService);

  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email])
  });

  message: string | null = null;
  error: string | null = null;


  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.authService.requestPasswordReset(this.form.value.email!)
    .subscribe({
      next: () => this.message = 'Ссылка для восстановления отправлена на почту',
      error: () => this.error = 'Ошибка при отправке письма',
    });
  }

}
