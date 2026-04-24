import { Component, Input, Output, EventEmitter } from '@angular/core';
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

  
  @Input('datos') products: IProduct[] = [];

 
  @Output() datoEmitido = new EventEmitter<string>();

  
  showImage: boolean = false;

  toggleImage(): void {
    this.showImage = !this.showImage;
  }

  enviarDato(): void {
    this.datoEmitido.emit('Hola desde el hijo 🚀');
  }

 
  constructor() {
    console.log('Hijo: constructor');
  }

  ngOnInit(): void {
    console.log('Hijo: ngOnInit');
  }

  ngOnChanges(): void {
    console.log('Hijo: ngOnChanges');
  }

  ngOnDestroy(): void {
    console.log('Hijo: ngOnDestroy');
  }
}
