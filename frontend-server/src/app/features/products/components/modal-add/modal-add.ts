import { Component, output, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, AbstractControl, AsyncValidatorFn } from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { Product } from '../../services/product';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-modal-add',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './modal-add.html',
  styleUrls: ['./modal-add.css']
})
export class ModalAdd {

  close = output<void>();

  private fb = inject(FormBuilder);
  private productService = inject(Product);

  formProduct = this.fb.group({
    name:        ['', Validators.required],
    code:        ['', [Validators.required, Validators.minLength(7)], this.codeValidator()],
    date:        ['', Validators.required],
    price:       [0, [Validators.required, Validators.min(0)]],
    description: ['', Validators.required],
    rating:      [0, [Validators.required, Validators.min(1), Validators.max(200)]],
  });

  codeValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<{ [key: string]: any } | null> => {
      let code = control.value;
      console.log('cliente - code:', code);
      return this.productService.searchProduct(code).pipe(
        map(res => {
          if (res) {
            console.log('Codigo encontrado:', res);
            return { codeExists: true };
          }
          console.log('Codigo no encontrado:', code);
          return null;
        })
      );
    };
  }

  saveData(): void {
  const producto = this.formProduct.value;
  const nuevoProducto = {
    productId:   0,
    productName: producto.name ?? '',
    productCode: producto.code ?? '',
    releaseDate: producto.date ?? '',
    price:       producto.price ?? 0,
    description: producto.description ?? '',
    starRating:  producto.rating ?? 0,
    imageUrl:    ''
  };
  this.productService.saveProduct(nuevoProducto).pipe(
    switchMap(() => this.productService.getProducts())
  ).subscribe((res: any) => {
    this.productService.products.set(res.productos);
    this.close.emit();
  });
}

  ocultarModal(): void {
    this.close.emit();
  }
}