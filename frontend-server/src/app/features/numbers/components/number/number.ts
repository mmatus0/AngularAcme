import { Component } from '@angular/core';
import { CdkVirtualScrollViewport, CdkVirtualForOf, CdkFixedSizeVirtualScroll } from '@angular/cdk/scrolling';

@Component({
  selector: 'app-number',
  imports: [CdkVirtualScrollViewport, CdkVirtualForOf, CdkFixedSizeVirtualScroll],
  templateUrl: './number.html',
  styleUrl: './number.css'
})
export class NumberComponent {
  numbers = new Array(1000).fill(0);
}