import { Component, effect, inject, linkedSignal, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IncidenciaService } from '../../core/services/incidencia.service';
import { UserService } from '../../core/services/user.service';
import { BuscadorComponent } from '../../shared/components/buscador/buscador.component';
import { Incidencia } from '../../core/models/incident.model';
import { Usuario } from '../../core/models/usuario.model';
import { DetalleModal, DetalleField } from '../../shared/components/detalle-modal/detalle-modal';
import { RouterLink } from '@angular/router';
import { ModalGeneric } from "@shared/components/modal-generic/modal-generic";
import { IncidenciaForm } from "@shared/components/incidencia-form/incidencia-form";
import { AuthService } from '@services/auth.service';

@Component({
  selector: 'app-incidents',
  standalone: true,
  imports: [CommonModule, DetalleModal, RouterLink, BuscadorComponent, ModalGeneric, IncidenciaForm],
  templateUrl: './incidencia.component.html',
})
export class IncidenciaComponent {
  private authService = inject(AuthService);
  incidentService = inject(IncidenciaService);
  userService = inject(UserService);
  filteredIncidents = linkedSignal<Incidencia[]>(() => this.incidentService.incidencias());

  constructor() {
    effect(() => {
      this.getIncidencias();
    });
  }

  getIncidencias() {
    if(this.authService.isEmpleado()){
      this.incidentService.misIncidencias().subscribe();
    }else if(this.authService.isTecnico()){
      this.incidentService.misIncidencias().subscribe();
    }else{
      this.incidentService.getIncidencias().subscribe();
    }


  }

  //Obtener de la busqueda
  onSearchResults(results: Incidencia[]): void {
    this.filteredIncidents.set(results);
  }

  //PARA VER EL DETALLE DE LA INCIDENCIAS
  verDetalle = signal(false);
  dataForModal = signal<Incidencia | null>(null);
  getIdIncidencia = signal(0);

  incidenciaFields: DetalleField<Incidencia>[] = [
    { label: 'Titulo', key: 'titulo' },
    { label: 'Descripcion', key: 'descripcion' },
    { label: 'Estado', key: 'estado' },
    { label: 'Fecha de Creacion', key: 'fechaCreacion' },
    { label: 'Usuario', key: 'usuario', format: (u: Usuario) => u.nombre },
    {
      label: 'Tecnico',
      key: 'tecnico',
      format: (u: Usuario | undefined) => u?.nombre ?? 'Sin asignar',
    },
  ];

  openModal(id: number): void {
    this.getIdIncidencia.set(id);
    this.verDetalle.update((v) => !v);
    if (this.verDetalle()) {
      this.incidentService.getIncidencia(id).subscribe({
        next: (value) => {
          this.dataForModal.set(value);
          console.log(value);
        },
      });
    }
  }

  //PARA CREAR UNA DE LA INCIDENCIAS
  isOpenCreate =  signal(false);
  changeIsOpenCreate(){
    this.isOpenCreate.update(i =>!i);
  }

  submitCreate(data:any){
    this.incidentService.createIncidencia(data).subscribe({
      next: (r) => {
        this.getIncidencias();
        this.isOpenCreate.set(false);
      },
      error:(e) => {
        console.log(e);

      }
    })
  }
}
