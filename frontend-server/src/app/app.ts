import { Component, signal, computed, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ProductList } from './product/product-list/product-list';
import { Star } from './product/product-list/star/star';
import { IProduct } from './product';
import { ProductService } from './services/product.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, HttpClientModule, ProductList, Star, CurrencyPipe],
  templateUrl: './app.html',
})
export class App implements OnInit {

  constructor(private productService: ProductService) {
    console.log('Padre: constructor');
  }

  ngOnInit(): void {
    console.log('Padre: ngOnInit');
    this.cargarProductos();
  }

  ngOnChanges(): void {
    console.log('Padre: ngOnChanges');
  }

  ngOnDestroy(): void {
    console.log('Padre: ngOnDestroy');
  }

  title = signal('Empresa ACME');
  listFilter = signal('');
  showImage = signal(true);
  showChildren = signal(true);
  datoRecibido = signal('');
  cargandoBackend = signal(false);
  errorBackend = signal('');

  products = signal<IProduct[]>([
    {
      productId: 1,
      productName: 'Zapatillas de lona',
      productCode: 'GDN-0011',
      releaseDate: 'March 19, 2016',
      price: 19.95,
      description: 'Zapatillas cómodas para uso diario.',
      starRating: 3.2,
      imageUrl: 'laptop1.jpg'
    },
    {
      productId: 2,
      productName: 'Bolso de cuero',
      productCode: 'GDN-0023',
      releaseDate: 'March 18, 2016',
      price: 32.99,
      description: 'Bolso resistente y elegante.',
      starRating: 4.2,
      imageUrl: 'auriculares.jpg'
    },
    {
      productId: 3,
      productName: 'Reloj antiguo',
      productCode: 'TBX-0048',
      releaseDate: 'May 21, 2016',
      price: 8.9,
      description: 'Reloj clásico decorativo.',
      starRating: 4.8,
      imageUrl: 'smartwatch.jpg'
    },
    {
      productId: 4,
      productName: 'Cámara fotográfica',
      productCode: 'TBX-0022',
      releaseDate: 'May 15, 2016',
      price: 11.55,
      description: 'Cámara fotográfica clásica.',
      starRating: 3.7,
      imageUrl: 'monitor.jpg'
    }
  ]);

  filteredProducts = computed(() =>
    this.products().filter(producto =>
      producto.productName.toLowerCase().includes(this.listFilter().toLowerCase())
    )
  );

  cargarProductos(): void {
    this.cargandoBackend.set(true);
    this.errorBackend.set('');
    this.productService.getProductos().subscribe({
      next: (resp) => {
        if (resp.ok && resp.productos.length > 0) {
          this.products.set(resp.productos);
        }
        this.cargandoBackend.set(false);
      },
      error: () => {
        this.errorBackend.set('Backend no disponible — mostrando datos locales');
        this.cargandoBackend.set(false);
      }
    });
  }

  toggleImage(): void {
    this.showImage.set(!this.showImage());
  }

  toggleChildren(): void {
    this.showChildren.update(value => !value);
  }
}
