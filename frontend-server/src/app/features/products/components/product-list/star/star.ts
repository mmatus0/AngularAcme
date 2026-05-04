import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-star',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './star.html',
  styleUrls: ['./star.css'],
})
export class Star implements OnChanges {

  // Declaramos una variable que almacenará el rating del producto — PDF 5.6b
  @Input() rating: number = 0;

  // Declaramos un arreglo con tantas celdas como estrellas tenga un producto — PDF 5.6b
  arr: any[] = [];

  // Usamos el hook ngOnChanges para recalcular el tamaño de las estrellas — PDF 5.6b
  ngOnChanges(changes: SimpleChanges): void {
    console.log('Star: ngOnChanges');
    this.arr = new Array(Math.min(Math.round(this.rating), 5)).fill(1);
  }
}
