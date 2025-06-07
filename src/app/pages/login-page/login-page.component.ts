
// handler страницы входа
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
    selector: 'app-login-page',
    standalone: true,
    imports: [ ReactiveFormsModule, CommonModule, RouterLink ],
    templateUrl: './login-page.component.html',
    styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {
  // Инициализация обращения к Frontend-а к Backend-у
  // Инициализация к перенаправлению на главную страницу
  authService = inject(AuthService);
  router = inject(Router);

  freezeError: string | null = null
  firstNameAccount: string | null = null
  // Настройка функции для отображения пароля
  isPasswordVisible = signal<boolean>(false);
  // Настройка функции для отправки после нажатой кнопки "Войти"
  isSubmitted = signal<boolean>(false);
  backendError = signal<string | null>(null);
  accountBlockedError = signal<string | null>(null);
  accountFreezeError = signal<string | null>(null);
  isFadingOut = signal(false);

  closeError(){
    this.isFadingOut.set(true);

    setTimeout(() => {
      this.accountBlockedError.set(null);
      this.isFadingOut.set(false);
    }, 300)
  }

  goToForgotPassword() {
    this.router.navigate(['/forgot-password'])
  }

  closeFreezeError(){
    this.isFadingOut.set(true);

    setTimeout(() => {
      this.accountFreezeError.set(null)
      this.isFadingOut.set(false);
    }, 300)
  }

  ngOnInit(): void {
    this.form.valueChanges.subscribe(() => {
      this.backendError.set(null);
    });
  }

  form = new FormGroup({
    username: new FormControl<string | null>(null, [
      Validators.required,
      Validators.minLength(3)
    ]),
    password: new FormControl<string | null>(null, [
      Validators.required,
    ]),
    rememberMe: new FormControl<boolean>(false)
  });

  onSubmit() {
       
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitted.set(true); 
    //@ts-ignore
    
    const username = this.form.get('username')?.value ?? '';
    const password = this.form.get('password')?.value ?? '';
    const rememberMe = this.form.get('rememberMe')?.value ?? false;
    this.authService.login({ username, password, rememberMe })
    .subscribe({
      next: (res) => {
        this.router.navigate(['']);
        console.log(res); 
      },
      error: (err) => {
        console.log(err);
        this.isSubmitted.set(false);

        if (err.status === 400) {
          this.backendError.set('Неверный username или пароль');
        } else if ( err.status === 403 ) {
          this.accountBlockedError.set('Ваш аккаунт заблокирован.')
          setTimeout(() => this.accountBlockedError.set(null), 3000)
        } else if (err.status === 423) {
          const untilRaw = err.error?.frozenUntil || err.error?.fronzenUntil;
          const date = new Date(untilRaw);

          if (!isNaN(date.getTime())) {
            const formattedDate = date.toLocaleString('ru-RU', {
              day: 'numeric',
              month: 'long',
              hour: '2-digit',
              minute: '2-digit'
            });

            
            this.firstNameAccount = err.error?.firstName || 'Пользователь';
            this.accountFreezeError.set(`Ваш аккаунт заморожен до ${formattedDate}`)
            setTimeout(() => this.accountFreezeError.set(null), 3000)
          } else {
            this.freezeError = 'Ваш аккаунт временно замарожен.'
          }

        } else {
          this.backendError.set('Ошибка сервера. Попробуйте позже.')
        }
      },
      complete: () => {
        this.isSubmitted.set(false);
      }
    })
  }
}
