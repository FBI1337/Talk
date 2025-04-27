import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';


@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [ ReactiveFormsModule, CommonModule ],
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.scss'
})
export class RegisterPageComponent {
  authService = inject(AuthService);
  router = inject(Router);

  isPasswordVisible = signal<boolean>(false);
  isConfirmPasswordVisible = signal<boolean>(false);
  isSubmitted = signal<boolean>(false);

  form = new FormGroup({
    username: new FormControl<string | null>(null, Validators.required),
    password: new FormControl<string | null>(null, Validators.required),
    confirmPassword: new FormControl<string | null>(null, Validators.required),
    email: new FormControl<string | null>(null, [Validators.required, Validators.email]),
  })

  onSubmit() {    
    if (this.form.valid) {
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



}
