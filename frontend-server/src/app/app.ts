import { Component, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ProductList } from './product/product-list/product-list';
import { ModalAdd } from './services/modal-add/modal-add';
import { IProduct, ProductService } from './product';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, ProductList, ModalAdd],
  templateUrl: './app.html',
})
export class App implements OnInit {

  constructor(private productService: ProductService) {
    console.log('Padre: constructor');
  }

  ngOnInit(): void {
    console.log('Padre: ngOnInit');
    this.productService.getProducts().subscribe((res: any) => {
      this.products.set(res.productos);
    });
  }

  ngOnChanges(): void { console.log('Padre: ngOnChanges'); }
  ngOnDestroy(): void { console.log('Padre: ngOnDestroy'); }

  title        = signal('Empresa ACME');
  listFilter   = signal('');
  showChildren = signal(true);
  datoRecibido = signal('');
  isModalOpen = signal(false);

  products = signal<IProduct[]>([
    { productId: 1, productName: 'Laptop',     productCode: 'TBX-0048', releaseDate: 'March 19, 2016', price: 19.95, description: 'Laptop de uso general.',         starRating: 3.2, imageUrl: 'laptop1.jpg'     },
    { productId: 2, productName: 'Auriculares', productCode: 'GDN-0011', releaseDate: 'March 18, 2016', price: 32.99, description: 'Auriculares inalámbricos.',       starRating: 4.2, imageUrl: 'auriculares.jpg' },
    { productId: 3, productName: 'Monitor',     productCode: 'TBX-0022', releaseDate: 'May 21, 2016',   price: 8.90,  description: 'Monitor Full HD.',                starRating: 4.8, imageUrl: 'monitor.jpg'     },
    { productId: 4, productName: 'Smartphone',  productCode: 'GDN-0023', releaseDate: 'May 15, 2016',   price: 11.55, description: 'Smartphone de última generación.',starRating: 3.7, imageUrl: 'smartphone.jpg'  }
  ]);

  filteredProducts = computed(() =>
    this.products().filter(producto =>
      producto.productName.toLowerCase().includes(this.listFilter().toLowerCase())
    )
  );

  abrirModal(): void {
    console.log('Abriendo modal');
    this.isModalOpen.set(true);
    console.log(this.isModalOpen());
  }

  cerrarModal(): void {
    console.log('Cerrando modal');
    this.isModalOpen.set(false);
  }
}