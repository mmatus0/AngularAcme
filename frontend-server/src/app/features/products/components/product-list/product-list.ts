import { Component, signal, computed, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IProduct } from '../../interfaces/product';
import { Product } from '../../services/product';
import { Star } from './star/star';
import { ModalAdd } from '../modal-add/modal-add';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule, Star, ModalAdd],
  templateUrl: './product-list.html',
  styleUrls: ['./product-list.css'],
})
export class ProductList implements OnInit {

  private productService = inject(Product);

  listFilter = signal('');
  showImage  = false;
  isModalOpen = signal(false);

  filteredProducts = computed(() =>
    this.productService.products().filter(p =>
      p.productName.toLowerCase().includes(this.listFilter().toLowerCase())
    )
  );

  ngOnInit(): void {
    this.productService.getProducts().subscribe((res: any) => {
      this.productService.products.set(res.productos);
    });
  }

  toggleImage(): void {
    this.showImage = !this.showImage;
  }

  abrirModal(): void {
    this.isModalOpen.set(true);
  }

  cerrarModal(): void {
    this.isModalOpen.set(false);
    this.productService.getProducts().subscribe((res: any) => {
      this.productService.products.set(res.productos);
    });
  }

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