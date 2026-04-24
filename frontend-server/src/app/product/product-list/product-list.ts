import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IProduct } from '../../product';
import { Star } from './star/star';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, Star],
  templateUrl: './product-list.html',
  styleUrls: ['./product-list.css'],
})
export class ProductList {
  @Input('datos') product: IProduct[] = [];
}