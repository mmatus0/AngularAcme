import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class Auth {

  // Señal que representa el estado de autenticación
  public isAuthenticated = signal<boolean>(false);

  private http = inject(HttpClient);
  private router = inject(Router);

  private urlLogin = 'http://localhost:3000/login';

  constructor() {
    // Verificar si el token existe al iniciar el servicio
    this.isAuthenticated.set(!!localStorage.getItem('token'));
  }

  // Ejecuta login, persiste token, actualiza estado y redirige al home
  login(email: string, password: string) {
    const userLogin = { email: email, password: password };
    return this.http.post(this.urlLogin, userLogin).pipe(
      map((resp: any) => {
        console.log('Login successful:', resp);
        localStorage.setItem('token', resp.token);
        localStorage.setItem('usuario', JSON.stringify(resp.usuario ?? resp));
        this.isAuthenticated.set(true);      
        this.router.navigate(['/home']);       
      })
    );
  }

  // Elimina el token, actualiza estado y redirige al login
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    this.isAuthenticated.set(false);          
    this.router.navigate(['/login']);          
  }

  // Retorna el token almacenado — usado por otros servicios
  getToken(): string | null {
    return localStorage.getItem('token');
  }
}