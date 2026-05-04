import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IProduct } from '../../interfaces/product';
import { Product } from '../../services/product';
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

  constructor(private productService: Product) {
    console.log('Hijo: constructor');
  }

  toggleImage(): void {
    this.showImage = !this.showImage;
  }

  ngOnInit(): void { console.log('Hijo: ngOnInit'); }
  ngOnChanges(): void { console.log('Hijo: ngOnChanges'); }
  ngOnDestroy(): void { console.log('Hijo: ngOnDestroy'); }

  borrarProducto(id: number): void {
    this.productService.deleteProduct(id).subscribe(() => {
      this.productService.getProducts().subscribe((res: any) => {
        this.productService.products.set(res.productos);
      });
    });
  }

  editarProducto(producto: IProduct): void {
    const productoActualizado: IProduct = {
      ...producto,
      price:       Math.round(Math.random() * 1000),
      starRating:  Math.round(Math.random() * 5),
      productCode: this.productService.generarCodigo()
    };
    this.productService.updateProduct(producto.productId, productoActualizado).subscribe(() => {
      this.productService.getProducts().subscribe((res: any) => {
        this.productService.products.set(res.productos);
      });
    });
  }
}