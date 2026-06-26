import { Component, signal } from '@angular/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-graficos',
  standalone: true,
  imports: [NgxChartsModule],
  templateUrl: './graficos.component.html',
  styleUrl: './graficos.component.css'
})
export class GraficosComponent {

  datosBarras = signal([
    { name: 'Enero',   value: 120 },
    { name: 'Febrero', value: 85  },
    { name: 'Marzo',   value: 140 },
    { name: 'Abril',   value: 95  },
    { name: 'Mayo',    value: 160 },
    { name: 'Junio',   value: 110 },
  ]);

  datosLineas = signal([
    {
      name: 'Ventas 2024',
      series: [
        { name: 'Ene', value: 100 },
        { name: 'Feb', value: 130 },
        { name: 'Mar', value: 90  },
        { name: 'Abr', value: 170 },
        { name: 'May', value: 140 },
        { name: 'Jun', value: 190 },
      ]
    },
    {
      name: 'Ventas 2023',
      series: [
        { name: 'Ene', value: 80  },
        { name: 'Feb', value: 110 },
        { name: 'Mar', value: 75  },
        { name: 'Abr', value: 130 },
        { name: 'May', value: 120 },
        { name: 'Jun', value: 150 },
      ]
    }
  ]);

  datosTorta = signal([
    { name: 'Electrónica', value: 35 },
    { name: 'Ropa',        value: 25 },
    { name: 'Alimentos',   value: 20 },
    { name: 'Deportes',    value: 12 },
    { name: 'Otros',       value: 8  },
  ]);

  colorScheme: any = 'cool';
  view = signal<[number, number]>([700, 350]);

  onSelect(event: any): void {
    console.log('Seleccionado:', event);
  }
}