
// handler страницы входа
import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
    selector: 'app-login-page',
    standalone: true,
    imports: [ ReactiveFormsModule, CommonModule ],
    templateUrl: './login-page.component.html',
    styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent {
  // Инициализация обращения к Frontend-а к Backend-у
  // Инициализация к перенаправлению на главную страницу
  authService = inject(AuthService);
  router = inject(Router);


  // Настройка функции для отображения пароля
  isPasswordVisible = signal<boolean>(false);
  // Настройка функции для отправки после нажатой кнопки "Войти"
  isSubmitted = signal<boolean>(false);

  form = new FormGroup({
    username: new FormControl<string | null>(null, Validators.required),
    password: new FormControl<string | null>(null, Validators.required)
  });

  onSubmit() {    
    if (this.form.valid) {
      this.isSubmitted.set(true); 
      //@ts-ignore
      this.authService.login(this.form.value)
      .subscribe({
        next: (res) => {
          this.router.navigate(['']);
          console.log(res); 
        },
        error: (err) => {
          console.log(err);
          this.isSubmitted.set(false);
        },
        complete: () => {
          this.isSubmitted.set(false);
        }
      })
    }
  }
}
