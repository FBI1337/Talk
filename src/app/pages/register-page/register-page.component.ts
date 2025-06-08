// handler страницы регистрации
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { cities } from 'src/app/data/constants/cities';


@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [ ReactiveFormsModule, CommonModule, RouterLink ],
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.scss'
})
export class RegisterPageComponent {
  // Инициализация обращения к Frontend-а к Backend-у
  authService = inject(AuthService);
  // Инициализация к перенаправлению на страницу входа
  router = inject(Router);

  cities: string[] = cities;
  filteredCities: string[] = [];
  cityFocused = false;
  fromSubmitted = false;

  // Настройка функции для отображения пароля
  isPasswordVisible = signal<boolean>(false);
  isConfirmPasswordVisible = signal<boolean>(false);
  // Настройка функции для отправки после нажатой кнопки "Зарегистрироваться"
  isSubmitted = signal<boolean>(false);

  form = new FormGroup({
    firstName: new FormControl<string | null>(null, [
      Validators.required,
      Validators.minLength(2)
    ]),
    lastName: new FormControl<string | null>(null, [
      Validators.required,
      Validators.minLength(2)
    ]),
    username: new FormControl<string | null>(null,[
      Validators.required,
      Validators.minLength(3),
      Validators.pattern(/^[a-zA-Z0-9_]+$/)
    ]),
    password: new FormControl<string | null>(null, [
      Validators.required,
      Validators.minLength(6),
      passwordStrengthValidator
    ]),
    confirmPassword: new FormControl<string | null>(null, Validators.required),
    email: new FormControl<string | null>(null, [
      Validators.required,
      Validators.email
    ]),
    city: new FormControl<string | null>(null, Validators.required)
  }, { 
    validators: passwordMatchValidator
  });


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

  onCityInput(event: Event) {
    const input = (event.target as HTMLInputElement).value.toLowerCase();
    this.filteredCities = this.cities.filter(city => city.toLowerCase().includes(input));
  }

  selectCity(city: string) {
    this.form.get('city')?.setValue(city);
    this.filteredCities = [];
    this.cityFocused = false;
  }

  onCityBlur() {
    setTimeout(() => {
      this.cityFocused = false;
    }, 200);
  }

  onCityFocus() {
    this.cityFocused = true;
  }

  onSubmit() {
    this.fromSubmitted = true;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

      this.isSubmitted.set(true);
      //@ts-ignore
      this.authService.register(this.form.value)
      .subscribe({
        next: (res) => {
          this.router.navigate(['login']);
          console.log(res); 
        },
        error: (err) => {
          console.log(err);
        },
        complete: () => {
          this.isSubmitted.set(false);
        }
      })
    }
}
function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password')?.value;
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
