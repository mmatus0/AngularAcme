import { Component } from '@angular/core';
import { faker } from '@faker-js/faker';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-product-pagination',
  imports: [CommonModule, NgxPaginationModule],
  templateUrl: './product-pagination.html',
  styleUrl: './product-pagination.css'
})
export class ProductPagination {
  p: number = 1;
  data = new Array(50).fill(1).map(() => ({
    name:  faker.commerce.productName(),
    code:  faker.string.alphanumeric(6).toUpperCase(),
    date:  faker.date.past().toLocaleDateString(),
    price: faker.commerce.price(),
    image: faker.image.url()
  }));
  total = this.data.length;
}