import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-recuperar-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './recuperar-password.component.html',
  styleUrl: './recuperar-password.component.css'
})
export class RecuperarPasswordComponent {

  private fb = inject(FormBuilder);
  private http = inject(HttpClient);

  enviado = signal(false);
  error = signal('');
  loading = signal(false);

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]]
  });

  enviar(): void {
    if (this.form.invalid) return;
    this.loading.set(true);
    this.error.set('');

    const email = this.form.value.email ?? '';
    this.http.post('http://localhost:3000/recuperar-password', { email }).subscribe({
      next: () => {
        this.enviado.set(true);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.error?.mensaje || 'Error al enviar el email');
        this.loading.set(false);
      }
    });
  }
}