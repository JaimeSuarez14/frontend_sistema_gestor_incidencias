import { Component, model, signal } from '@angular/core';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-detalle-incidencia',
  imports: [RouterLink],
  templateUrl: './detalle-incidencia.html',
  styleUrl: './detalle-incidencia.css',
})
export class DetalleIncidencia {
  modal = model(false)

  openBox(){
    this.modal.update(m => !m)
  }
}
