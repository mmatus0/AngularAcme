import { Component, signal, computed, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ProductList } from './features/products/components/product-list/product-list';
import { ModalAdd } from './features/products/components/modal-add/modal-add';
import { Product } from './features/products/services/product';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, ProductList, ModalAdd],
  templateUrl: './app.html',
})
export class App implements OnInit {

  productService = inject(Product);

  constructor() {
      console.log('Padre: constructor');
  }

  ngOnInit(): void {
    console.log('Padre: ngOnInit');
    this.productService.getProducts().subscribe((products: any) => {
      this.productService.products.set(products.productos);
    });
  }

  ngOnChanges(): void { console.log('Padre: ngOnChanges'); }
  ngOnDestroy(): void { console.log('Padre: ngOnDestroy'); }

  title      = signal('Empresa ACME');
  listFilter = signal('');
  isModalOpen = signal(false);

  filteredProducts = computed(() =>
    this.productService.products().filter(p =>
      p.productName.toLowerCase().includes(this.listFilter().toLowerCase())
    )
  );

  abrirModal(): void {
    console.log('Abriendo modal');
    this.isModalOpen.set(true);
  }

  cerrarModal(): void {
    console.log('Cerrando modal');
    this.isModalOpen.set(false);
  }
}