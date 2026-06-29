import { Component, inject, signal, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent implements OnInit {

  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  token = signal('');
  exito = signal(false);
  error = signal('');
  loading = signal(false);

  form = this.fb.group({
    nuevaPassword:    ['', [Validators.required, Validators.minLength(4)]],
    confirmarPassword: ['', Validators.required]
  });

  ngOnInit(): void {
    const t = this.route.snapshot.queryParamMap.get('token') ?? '';
    this.token.set(t);
    if (!t) this.error.set('Token no válido');
  }

  resetear(): void {
    if (this.form.invalid) return;
    const { nuevaPassword, confirmarPassword } = this.form.value;
    if (nuevaPassword !== confirmarPassword) {
      this.error.set('Las contraseñas no coinciden');
      return;
    }
    this.loading.set(true);
    this.error.set('');

    this.http.post('http://localhost:3000/reset-password', {
      token: this.token(),
      nuevaPassword
    }).subscribe({
      next: () => {
        this.exito.set(true);
        this.loading.set(false);
        setTimeout(() => this.router.navigate(['/login']), 3000);
      },
      error: (err) => {
        this.error.set(err.error?.mensaje || 'Error al restablecer la contraseña');
        this.loading.set(false);
      }
    });
  }
}