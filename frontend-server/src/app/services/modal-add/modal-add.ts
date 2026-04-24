import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal-add',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal-add.html',
  styleUrls: ['./modal-add.css']
})
export class ModalAdd {

  @Output() close = new EventEmitter<void>();

  ocultarModal(): void {
    this.close.emit();
  }
}