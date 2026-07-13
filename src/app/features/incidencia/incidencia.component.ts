import { Component, computed, effect, inject, linkedSignal, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IncidenciaService } from '../../core/services/incidencia.service';
import { UserService } from '../../core/services/user.service';
import { BuscadorComponent } from '../../shared/components/buscador/buscador.component';
import { Incidencia, Status } from '../../core/models/incident.model';
import { Page, TecnicosDTO, Usuario } from '../../core/models/usuario.model';
import { DetalleModal, DetalleField } from '../../shared/components/detalle-modal/detalle-modal';
import { RouterLink } from '@angular/router';
import { ModalGeneric } from '@shared/components/modal-generic/modal-generic';
import { IncidenciaForm } from '@shared/components/incidencia-form/incidencia-form';
import { AuthService } from '@services/auth.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { BuscadorInput } from '@shared/components/buscador-input/buscador-input';
import { single, Subscription } from 'rxjs';
import { LoadingSpinner } from "@shared/components/loading-spinner/loading-spinner";

@Component({
  selector: 'app-incidents',
  standalone: true,
  imports: [
    CommonModule,
    DetalleModal,
    RouterLink,
    ReactiveFormsModule,
    ModalGeneric,
    IncidenciaForm,
    BuscadorInput,
    LoadingSpinner
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
      this.searchTerm();
      this.pageCurrent.set(0);
    });

    effect(() => {
      this.pageCurrent();
      this.size();
      this.searchTerm();
      this.getIncidencias();
    });
  }

  //PARA EVITAR LA CONDICION DE CARRERA
  private searchSub?: Subscription;

  loading = signal(false);

  getIncidencias() {
    this.searchSub?.unsubscribe();
    this.loading.set(true);

    if (this.authService.isEmpleado() || this.authService.isTecnico()) {
      this.searchSub = this.incidentService
        .misIncidencias(this.pageCurrent(), this.size(), this.searchTerm())
        .subscribe({
          next: (e) => {
            console.log(e);
            this.page.set(e?.page);
            this.loading.set(false);
          },
          error: (e) => {
            console.log(e);
          },
        });
    } else {
      this.searchSub = this.incidentService
        .getIncidencias(this.pageCurrent(), this.size(), this.searchTerm())
        .subscribe({
          next: (e) => {
            this.page.set(e?.page);
            this.loading.set(false);
          },
          error: (e) => {
            console.log(e?.error?.message);
          },
        });
    }
  }

  //busqueda en el servidor, se conecta con el modal del componente
  searchTerm = signal('');

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
  loadingEstado = signal(false);
  estados: Status[] = ['ABIERTO', 'CERRADO', 'PENDIENTE'];

  changeState(id: number, estado: Status) {
    this.formUpdateEstado.patchValue({ id: id, estado: estado });
    this.isOpenChangeState.update((i) => !i);
  }

  submitChangeState() {
    this.loadingEstado.set(true);
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
        this.loadingEstado.set(false);
        this.formUpdateEstado.reset();
        this.isOpenChangeState.set(false);
        this.getIncidencias();
      },
    });
  }

  /* PAGINACION */
  pageCurrent = signal(0);
  page = signal<Page | null>(null);
  size = signal(5);

  onPageChange(pagina: number) {
    this.pageCurrent.set(pagina);
  }

  botones = computed(() => {
    const total = this.page()?.totalPages || 1;
    const current = this.pageCurrent();
    const paginas: number[] = [];

    if (total <= 7) {
      // Caso simple: pocas páginas, se muestran todas
      for (let i = 0; i < total; i++) paginas.push(i);
      return { paginas, total };
    }

    // Siempre incluir primera página
    paginas.push(0);

    // Mostrar rango alrededor de la página actual
    const start = Math.max(current - 2, 1);
    const end = Math.min(current + 2, total - 2);

    if (start > 1) {
      // Hay hueco entre primera y el rango → insertar "..."
      paginas.push(-1); // usamos -1 como marcador de "..."
    }

    for (let i = start; i <= end; i++) {
      paginas.push(i);
    }

    if (end < total - 2) {
      // Hay hueco entre el rango y la última → insertar "..."
      paginas.push(-1);
    }

    // Siempre incluir última página
    paginas.push(total - 1);

    return { paginas, total };
  });

  esqueletor = computed(() => Array.from({ length: this.size() }, (_, i) => i));

  //Asignar un tecnico a la incidencia.
  tecnicos = signal<TecnicosDTO[] | null>(null);
  isOpenModalTecnicos = signal(false);
  incidenciaModal = signal<Incidencia | null>(null);
  elegirTecnico = signal(Array.from({ length: this.tecnicos()?.length || 0 }, (s, i) => false));

  changeIsOpenTecnicos(incidencia?: Incidencia) {
    if(incidencia){
      this.incidenciaModal.set(incidencia);
    }
    this.isOpenModalTecnicos.update((i) => !i);
    if(this.isOpenModalTecnicos()){
      this.cargarTecnicos();
    }else{
      this.elegirTecnico.set([]);
      this.idTecnicoUpdate.set(0n);
      this.errorTecnico.set("")
    }
  }
  loadingTecnicos = signal<boolean>(false);

  cargarTecnicos() {
    this.loadingTecnicos.set(true);
    this.userService.listarTecnicos().subscribe({
      next: (e) => {
        this.tecnicos.set(e.dato);
        console.log(e)
        this.elegirTecnico.set(Array.from({ length: e.dato.length }, () => false));
        this.loadingTecnicos.set(false);
      },
      error: (error) => {
        console.log(error?.error);
        this.loadingTecnicos.set(false);

      },
    });
  }

  idTecnicoUpdate = signal(0n);
  seleccionarTecnico(index: number, id: bigint){
    this.elegirTecnico.update(e => e.map((val, i) => index === i ? !val : false));
    this.idTecnicoUpdate.set(id);
  }
  errorTecnico = signal("");
  asignarTecnicoIncidencia(){
    this.errorTecnico.set("");
    this.loadingTecnicos.set(true);
    const data: { idIncidencia: number; idTecnico: number } = {
      idIncidencia: this.incidenciaModal()?.id!,
      idTecnico: this.convertirNumber(this.idTecnicoUpdate()),
    };
    this.incidentService.cambiarTecnico(data).subscribe({
      next:() => {
        this.loadingTecnicos.set(false);
        this.elegirTecnico.set([]);
        this.idTecnicoUpdate.set(0n);
        this.isOpenModalTecnicos.set(false)
        this.getIncidencias();

      },
      error:(error) => {
        this.errorTecnico.set(error?.error?.message)
        console.log(error);
        this.loadingTecnicos.set(false);
      }
    })
  }


  convertirNumber(id: bigint){
    return Number(id);
  }
}
