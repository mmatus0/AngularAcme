import { Component, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ProductList } from './product/product-list/product-list';
import { IProduct, ProductService } from './product';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, ProductList],
  templateUrl: './app.html',
})
export class App implements OnInit {

  
  constructor(private productService: ProductService) {
    console.log('Padre: constructor');
  }

  ngOnInit(): void {
    console.log('Padre: ngOnInit');
    
    this.productService.getProducts().subscribe(res => {
      this.products.set(res.productos);
    });
  }

  ngOnChanges(): void {
    console.log('Padre: ngOnChanges');
  }

  ngOnDestroy(): void {
    console.log('Padre: ngOnDestroy');
  }

  title = signal('Empresa ACME');


  listFilter = signal('');

  showChildren = signal(true);

  datoRecibido = signal('');

  
  products = signal<IProduct[]>([
    {
      productId: 1,
      productName: 'Laptop',
      productCode: 'TBX-0048',
      releaseDate: 'March 19, 2016',
      price: 19.95,
      description: 'Laptop de uso general.',
      starRating: 3.2,
      imageUrl: 'laptop1.jpg'
    },
    {
      productId: 2,
      productName: 'Auriculares',
      productCode: 'GDN-0011',
      releaseDate: 'March 18, 2016',
      price: 32.99,
      description: 'Auriculares inalámbricos.',
      starRating: 4.2,
      imageUrl: 'auriculares.jpg'
    },
    {
      productId: 3,
      productName: 'Monitor',
      productCode: 'TBX-0022',
      releaseDate: 'May 21, 2016',
      price: 8.9,
      description: 'Monitor Full HD.',
      starRating: 4.8,
      imageUrl: 'monitor.jpg'
    },
    {
      productId: 4,
      productName: 'Smartphone',
      productCode: 'GDN-0023',
      releaseDate: 'May 15, 2016',
      price: 11.55,
      description: 'Smartphone de última generación.',
      starRating: 3.7,
      imageUrl: 'smartphone.jpg'
    }
  ]);

  filteredProducts = computed(() =>
    this.products().filter(producto =>
      producto.productName.toLowerCase().includes(this.listFilter().toLowerCase())
    )
  );

  toggleChildren(): void {
    this.showChildren.update(value => !value);
  }

  crearProducto(): void {
    const nuevoProducto: IProduct = {
      productId: 0,
      productName: 'Nuevo Producto',
      productCode: this.productService.generarCodigo(),
      releaseDate: new Date().toLocaleDateString(),
      price: Math.round(Math.random() * 100),
      description: 'Descripción del nuevo producto',
      starRating: Math.round(Math.random() * 5),
      imageUrl: 'tablet.jpg'
    };

    this.productService.saveProduct(nuevoProducto).subscribe(res => {
      console.log('Producto creado:', res);
     
      this.productService.getProducts().subscribe(res2 => {
        this.products.set(res2.productos);
      });
    });
  }
}
