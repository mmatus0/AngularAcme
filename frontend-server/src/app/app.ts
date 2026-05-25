import { Component, signal, inject } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { Auth } from './features/auth/services/auth';
import { Login } from './features/auth/components/login/login';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    Login         // Directiva requerida en la UI — Slide 21
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  protected readonly title = signal('Empresa ACME');

  // Inyección del servicio de autenticación — Slide 21
  authService = inject(Auth);

  logout(): void {
    this.authService.logout();
  }
}