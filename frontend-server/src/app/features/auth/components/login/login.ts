import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Auth } from '../../services/auth';
import { SocialAuthService, GoogleSigninButtonModule } from '@abacritt/angularx-social-login';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, GoogleSigninButtonModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {

  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(Auth);
  private readonly socialAuthService = inject(SocialAuthService);

  loginForm = this.fb.group({
    email:    ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  constructor() {
    this.socialAuthService.authState.subscribe((user) => {
      if (user) {
        this.authService.loginConGoogle(user.idToken ?? '').subscribe({
          next: () => console.log('Login con Google exitoso'),
          error: (err) => console.error('Error Google login:', err)
        });
      }
    });
  }

  login(): void {
    if (this.loginForm.invalid) return;
    const email = this.loginForm.value.email ?? '';
    const password = this.loginForm.value.password ?? '';
    this.authService.login(email, password).subscribe({
      next: () => console.log('Login exitoso'),
      error: (err) => console.error('Error en login:', err)
    });
  }
}