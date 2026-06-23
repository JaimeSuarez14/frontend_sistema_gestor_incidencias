import { Component, effect, inject, linkedSignal, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IncidenciaService } from '../../core/services/incidencia.service';
import { UserService } from '../../core/services/user.service';
import { BuscadorComponent } from '../../shared/components/buscador/buscador.component';
import { Incidencia, Status } from '../../core/models/incident.model';
import { Usuario } from '../../core/models/usuario.model';
import { DetalleModal, DetalleField } from '../../shared/components/detalle-modal/detalle-modal';
import { RouterLink } from '@angular/router';
import { ModalGeneric } from '@shared/components/modal-generic/modal-generic';
import { IncidenciaForm } from '@shared/components/incidencia-form/incidencia-form';
import { AuthService } from '@services/auth.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-incidents',
  standalone: true,
  imports: [
    CommonModule,
    DetalleModal,
    RouterLink,
    BuscadorComponent,
    ReactiveFormsModule,
    ModalGeneric,
    IncidenciaForm,
  ],
  templateUrl: './incidencia.component.html',
})
export class IncidenciaComponent {
  authService = inject(AuthService);
  incidentService = inject(IncidenciaService);
  userService = inject(UserService);
  filteredIncidents = linkedSignal<Incidencia[]>(() => this.incidentService.incidencias());

  constructor() {
    effect(() => {
      this.getIncidencias();
    });
  }

  loading = signal(false);
  getIncidencias() {
    this.loading.set(true);
    if (this.authService.isEmpleado() || this.authService.isTecnico()) {
      this.incidentService
        .misIncidencias()
        .pipe()
        .subscribe((e) => {
          this.loading.set(false);
          return e;
        });
    } else {
      this.incidentService
        .getIncidencias()
        .pipe()
        .subscribe((e) => {
          this.loading.set(false);
          return e;
        });
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
  isOpenCreate = signal(false);
  changeIsOpenCreate() {
    this.isOpenCreate.update((i) => !i);
  }

  submitCreate(data: any) {
    this.incidentService.createIncidencia(data).subscribe({
      next: (r) => {
        this.getIncidencias();
        this.isOpenCreate.set(false);
      },
      error: (e) => {
        console.log(e);
      },
    });
  }

  //Cambiar el estado de la incidencia
  isOpenChangeState = signal(false);
  private fb = inject(FormBuilder);
  formUpdateEstado = this.fb.group({
    id: [0, [Validators.min(1)]],
    estado: ['', [Validators.required, Validators.minLength(4)]],
  });
  loadingEstado = signal(false)
  estados: Status[] = ['ABIERTO', 'CERRADO', 'PENDIENTE'];

  changeState(id: number, estado: Status) {
    this.formUpdateEstado.patchValue({ id: id, estado: estado });
    this.isOpenChangeState.update((i) => !i);
  }

  submitChangeState() {
    this.loadingEstado.set(true)
    if (this.formUpdateEstado.invalid) {
      this.formUpdateEstado.markAllAsTouched();
      return;
    }
    const payload = this.formUpdateEstado.getRawValue();
    const data: { idIncidencia: number; estado: string } = {
      idIncidencia: payload.id!,
      estado: payload.estado!,
    };

    this.incidentService.cambiarEstado(data).subscribe({
      next: (incidenciaActualizada) => {
        this.loadingEstado.set(false)
        this.formUpdateEstado.reset();
        this.isOpenChangeState.set(false);
        this.getIncidencias();
      },
    });
  }
}
