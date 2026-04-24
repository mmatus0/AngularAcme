import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-star',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './star.html',
  styleUrls: ['./star.css'],
})
export class Star {

  @Input() rating: number = 0;

  stars = signal(4);

  arr: any[] = new Array(this.stars()).fill(1);
}