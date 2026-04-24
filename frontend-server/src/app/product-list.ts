import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card mt-3">
      <div class="card-header bg-secondary text-white">
        Componente Hijo
      </div>

      <div class="card-body">

        <button class="btn btn-primary mb-2" (click)="enviarDato()">
          Enviar dato al padre
        </button>

        <ul class="list-group">
          @for (item of datos; track item.productCode) {
            <li class="list-group-item">
              {{ item.productName }}
            </li>
          }
        </ul>

      </div>
    </div>
  `
})
export class ProductList {

  @Input() datos: any[] = [];

  @Output() datoEmitido = new EventEmitter<string>();

  enviarDato() {
    this.datoEmitido.emit('Hola desde el hijo 🚀');
  }
}