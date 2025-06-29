import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-reset-password-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './reset-password-page.component.html',
  styleUrl: './reset-password-page.component.scss'
})
export class ResetPasswordPageComponent implements OnInit{
  authService = inject(AuthService);
  route = inject(ActivatedRoute);
  router = inject(Router);


  isPasswordVisible = signal<boolean>(false);
  isConfirmPasswordVisible = signal<boolean>(false);

  token = this.route.snapshot.queryParamMap.get('token');

  form = new FormGroup({
    newPassword: new FormControl('', [Validators.required, Validators.minLength(6), passwordStrengthValidator]),
    confirmPassword: new FormControl('', [Validators.required]),
  },
  {
    validators: passwordMatchValidator
  });

  ngOnInit(): void {
    if(!this.token) {
      this.router.navigate(['/404']);
      return;
    }

    this.authService.verifyResetToken(this.token).subscribe({
      next: () => {

      },

      error: () => {
        this.router.navigate(['/404'])
      }
    })
  }


  getPasswordClass(): string {
  const control = this.form.get('password');

  if (control?.hasError('passwordTooWeak') && (control.dirty || control.touched)) {
    return 'tt-input input-error-weak';
  }

  if (control?.hasError('passwordWeak') && (control.dirty || control.touched)) {
    return 'tt-input input-warning-weak';
  }

  return 'tt-input input-err';
}


  message: string | null = null;
  error: string | null = null;

  onSubmit(){
    if (this.form.invalid || this.form.value.newPassword !== this.form.value.confirmPassword) {
      this.error = 'Пароли не совпадают или невалидны';
      return;
    }

    const newPassword = this.form.value.newPassword!;

    this.authService.resetPassword(this.token!, newPassword).subscribe({
      next: () => {
        this.message = 'Пароль успешно изменен!';
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },

      error: (err) => {
        if (err.status === 400) {
          this.error = 'Срок действия ссылки истек. Пожалуйста запросите новую.';
          setTimeout(() => 'Ошибка при сбросе пароля. Попробуйте снова');
        }
      },
    });
  }
}
function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('newPassword')?.value;
  const confirm = control.get('confirmPassword')?.value;
  return password === confirm ? null : { passwordMismatch: true}
}
function passwordStrengthValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value;
  if(!value) return null;

  let strength = 0

  if (value.length >= 6) strength++;
  if (/[A-Z]/.test(value)) strength++;
  if (/[0-9]/.test(value)) strength++;
  if (/[^A-Za-z0-9]/.test(value)) strength++;

  if (strength <= 1) {
    return { passwordTooWeak: true};
  } else if ( strength === 2) {
    return { passwordWeak: true}
  }

  return null;
}
