import { Component, output, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, AbstractControl, AsyncValidatorFn } from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { Product } from '../../services/product';

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
    console.log('Guardando producto:', this.formProduct.value);
  }

  ocultarModal(): void {
    this.close.emit();
  }
}