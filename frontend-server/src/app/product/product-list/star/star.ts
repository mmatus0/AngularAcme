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

  @Input() rating: number = 0;

  // Array de estrellas llenas (hasta 5 máximo)
  fullStars: number[] = [];
  // Estrellas vacías para completar hasta 5
  emptyStars: number[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['rating']) {
      const full = Math.round(this.rating);
      this.fullStars = new Array(Math.min(full, 5)).fill(0);
      this.emptyStars = new Array(Math.max(5 - full, 0)).fill(0);
    }
  }
}
