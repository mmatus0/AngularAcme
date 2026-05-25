import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Auth {

  // Señal que representa el estado de autenticación — Slide 5
  isAuthenticated = signal<boolean>(this.tokenExists());

  private urlLogin = 'http://localhost:3000/login';

  constructor(private http: HttpClient) {}

  // Verifica si existe un token en localStorage al iniciar — Slide 22
  private tokenExists(): boolean {
    return !!localStorage.getItem('token');
  }

  // Ejecuta login con el backend, persiste token y actualiza estado — Slide 18
  login(email: string, password: string): Observable<any> {
    return this.http.post(this.urlLogin, { email, password }).pipe(
      tap((res: any) => {
        localStorage.setItem('token', res.token);   // Persiste en localStorage
        this.isAuthenticated.set(true);              // Actualiza el estado
      })
    );
  }

  // Elimina el token del localStorage y actualiza el estado — Slide 22
  logout(): void {
    localStorage.removeItem('token');
    this.isAuthenticated.set(false);
  }

  // Retorna el token almacenado — usado por otros servicios — Slide 19
  getToken(): string | null {
    return localStorage.getItem('token');
  }
}