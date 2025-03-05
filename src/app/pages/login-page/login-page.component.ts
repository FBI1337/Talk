import { Component, inject } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
    selector: 'app-login-page',
    standalone: true,
    imports: [ 
      ReactiveFormsModule
     ],
    templateUrl: './login-page.component.html',
    styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent {
  authService = inject(AuthService);
  router = inject(Router);

  form = new FormGroup({
    username: new FormControl<string | null>(null, Validators.required),
    password: new FormControl<string | null>(null, Validators.required)
  });

  onSubmit() {    
    if (this.form.valid) {
      //@ts-ignore
      this.authService.login(this.form.value)
      .subscribe(res => {
        this.router.navigate(['']);
        console.log(res);
      })
    }
  }
}
