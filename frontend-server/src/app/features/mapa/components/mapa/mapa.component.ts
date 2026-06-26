import { Component, signal, OnInit } from '@angular/core';
import { GoogleMap, MapMarker, MapInfoWindow } from '@angular/google-maps';
import { DecimalPipe } from '@angular/common';

interface Marcador {
  position: google.maps.LatLngLiteral;
  label: string;
  title: string;
}

@Component({
  selector: 'app-mapa',
  standalone: true,
  imports: [GoogleMap, MapMarker, MapInfoWindow, DecimalPipe],
  templateUrl: './mapa.component.html',
  styleUrl: './mapa.component.css'
})
export class MapaComponent implements OnInit {

  center = signal<google.maps.LatLngLiteral>({ lat: -36.6063, lng: -72.1034 });
  zoom = signal<number>(13);

  mapOptions = signal<google.maps.MapOptions>({
    mapTypeId: 'roadmap',
    zoomControl: true,
    scrollwheel: true,
    disableDoubleClickZoom: false,
    maxZoom: 20,
    minZoom: 5,
  });

  marcadores = signal<Marcador[]>([
    { position: { lat: -36.6063, lng: -72.1034 }, label: 'U', title: 'Universidad del Bío-Bío' },
    { position: { lat: -36.6100, lng: -72.1000 }, label: 'A', title: 'Punto A' },
    { position: { lat: -36.6020, lng: -72.1070 }, label: 'B', title: 'Punto B' },
  ]);

  marcadorSeleccionado = signal<Marcador | null>(null);

  ngOnInit(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => this.center.set({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (err) => console.warn('Geolocalización no disponible:', err)
      );
    }
  }

  abrirInfoWindow(marcador: Marcador, infoWindow: MapInfoWindow, markerRef: MapMarker): void {
    this.marcadorSeleccionado.set(marcador);
    infoWindow.open(markerRef);
  }

  agregarMarcador(event: google.maps.MapMouseEvent): void {
    if (event.latLng) {
      const nuevos = [...this.marcadores()];
      nuevos.push({
        position: { lat: event.latLng.lat(), lng: event.latLng.lng() },
        label: String(nuevos.length + 1),
        title: `Marcador ${nuevos.length + 1}`
      });
      this.marcadores.set(nuevos);
    }
  }
}