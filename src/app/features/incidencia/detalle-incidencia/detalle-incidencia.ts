import { Incidencia } from './../../../core/models/incident.model';
import { Component, inject, input, model, OnInit, signal } from '@angular/core';
import { RouterLink } from "@angular/router";
import { IncidenciaService } from '@services/incident.service';

@Component({
  selector: 'app-detalle-incidencia',
  imports: [RouterLink],
  templateUrl: './detalle-incidencia.html',
  styleUrl: './detalle-incidencia.css',
})
export class DetalleIncidencia implements OnInit {
  modal = model(false);
  incidenciaId =  model<number |null>();

  incidencia = signal< null | Incidencia>(null)
  incidentService = inject(IncidenciaService);

  ngOnInit(){
    if(this.incidenciaId() ){
      const newIncide = this.incidentService.getIncidencia(this.incidenciaId()!);
      if(newIncide){
        this.incidencia.set(newIncide);
        console.log(newIncide);

      }
    }
  }

  openBox(){
    this.modal.update(m => !m)
  }
}
