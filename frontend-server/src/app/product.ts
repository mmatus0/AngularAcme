import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface IProduct {
  productId: number;
  productName: string;
  productCode: string;
  releaseDate: string;
  price: number;
  description: string;
  starRating: number;
  imageUrl: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private urlProductos = 'http://localhost:3000/productos';
  private urlProducto  = 'http://localhost:3000/producto';

  constructor(private http: HttpClient) {}

  
  generarCodigo(): string {
    return 'PROD' + Math.floor(Math.random() * 1000);
  }

  getProducts(): Observable<any> {
    return this.http.get(this.urlProductos);
  }

  saveProduct(producto: IProduct): Observable<any> {
    const body = {
      name:        producto.productName,
      code:        producto.productCode,
      date:        producto.releaseDate,
      price:       producto.price,
      description: producto.description,
      rate:        producto.starRating,
      image:       producto.imageUrl
    };
    return this.http.post(this.urlProducto, body);
  }

  deleteProduct(id: number): Observable<any> {
    return this.http.delete(`${this.urlProducto}/${id}`);
  }

  updateProduct(id: number, producto: IProduct): Observable<any> {
    const body = {
      name:        producto.productName,
      code:        producto.productCode,
      date:        producto.releaseDate,
      price:       producto.price,
      description: producto.description,
      rate:        producto.starRating,
      image:       producto.imageUrl
    };
    return this.http.put(`${this.urlProducto}/${id}`, body);
  }
}
