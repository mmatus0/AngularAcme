import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IProduct } from '../product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  // Obtener todos los productos
  getProductos(): Observable<{ ok: boolean; productos: IProduct[] }> {
    return this.http.get<{ ok: boolean; productos: IProduct[] }>(`${this.apiUrl}/productos`);
  }

  // Obtener un producto por ID
  getProducto(id: number): Observable<{ ok: boolean; producto: IProduct }> {
    return this.http.get<{ ok: boolean; producto: IProduct }>(`${this.apiUrl}/producto/${id}`);
  }

  // Agregar producto
  addProducto(producto: Partial<IProduct>): Observable<{ ok: boolean; mensaje: string; id: number }> {
    const body = {
      name: producto.productName,
      code: producto.productCode,
      date: producto.releaseDate,
      price: producto.price,
      description: producto.description,
      rate: producto.starRating,
      image: producto.imageUrl
    };
    return this.http.post<{ ok: boolean; mensaje: string; id: number }>(`${this.apiUrl}/producto`, body);
  }

  // Actualizar producto
  updateProducto(id: number, producto: Partial<IProduct>): Observable<{ ok: boolean; mensaje: string }> {
    const body = {
      name: producto.productName,
      code: producto.productCode,
      date: producto.releaseDate,
      price: producto.price,
      description: producto.description,
      rate: producto.starRating,
      image: producto.imageUrl
    };
    return this.http.put<{ ok: boolean; mensaje: string }>(`${this.apiUrl}/producto/${id}`, body);
  }

  // Eliminar producto
  deleteProducto(id: number): Observable<{ ok: boolean; mensaje: string }> {
    return this.http.delete<{ ok: boolean; mensaje: string }>(`${this.apiUrl}/producto/${id}`);
  }

  // Subir imagen
  uploadImagen(id: number, file: File): Observable<{ ok: boolean; mensaje: string; imageUrl: string }> {
    const formData = new FormData();
    formData.append('image', file);
    return this.http.put<{ ok: boolean; mensaje: string; imageUrl: string }>(
      `${this.apiUrl}/upload/productos/${id}`,
      formData
    );
  }
}
