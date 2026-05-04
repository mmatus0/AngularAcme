import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IProduct } from '../interfaces/product';
import { map, switchMap } from 'rxjs/operators';
import { timer } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Product {

  products = signal<IProduct[]>([]);

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

  searchProduct(code: string): Observable<any> {
  return timer(1000).pipe(
    switchMap(() => {
      return this.http.get<any>(`http://localhost:3000/existeproducto/${code}`).pipe(
        map((resp: any) => resp.data)
      );
    })
  );
}


}