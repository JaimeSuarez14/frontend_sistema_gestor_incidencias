import { convertirRol } from './../../shared/utils/convertidoFunction';
import { Component, effect, inject, linkedSignal, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '@services/user.service';
import { Page, RegisterData, Rol, Role, Usuario } from 'src/app/core/models/usuario.model';
import { BuscadorComponent } from 'src/app/shared/components/buscador/buscador.component';
import { ModalGeneric } from '@shared/components/modal-generic/modal-generic';
import { UserFormComponent } from '@shared/components/user-form-component/user-form-component';
import { UpdateUserForm } from './update-user-form/update-user-form';
import { AuthService } from '@services/auth.service';
import { DetalleModal, DetalleField } from '@shared/components/detalle-modal/detalle-modal';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule,
    BuscadorComponent,
    ModalGeneric,
    UserFormComponent,
    UpdateUserForm,
    DetalleModal,
    ReactiveFormsModule,
  ],
  templateUrl: './users.component.html',
})
export class UsersComponent {
  userService = inject(UserService);
  authService = inject(AuthService);
  usuarios = signal<Usuario[]>([]);
  loading = signal(true);
  error = signal('');
  filteredUsers = linkedSignal<Usuario[]>(() => this.usuarios());

  constructor() {
    effect(() => {
      this.getUsuarios();
    });
  }

  onSearchResults(results: Usuario[]): void {
    this.filteredUsers.set(results);
  }

  getUsuarios(): void {
    this.loading.set(true);
    this.userService.getUsersPaginados(this.pageCurrent(), this.size()).subscribe({
      next: (data) => {
        console.log(data);
        this.usuarios.set(data?.content);
        this.page.set(data?.page);
        this.loading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.error.set(err);
        this.loading.set(false);
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
    if (total <= 3) {
      const paginas = Array.from({ length: total }, (_, i) => i);
      return { paginas, total };
    }

    return { paginas: [0, 1, 2], total };
  });

  /**PARA VER DETALLES DEL USUARIO */
  verDetalle = signal(false);
  dataForModal = signal<Usuario | null>(null);

  fieldsUser: DetalleField<Usuario>[] = [
    { label: 'Id', key: 'id' },
    { label: 'Username', key: 'username' },
    { label: 'Nombre', key: 'nombre' },
    { label: 'Correo', key: 'correo' },
    { label: 'Area', key: 'area' },
    { label: 'Estado', key: 'estado' },
  ];

  openModal(id: bigint): void {
    this.verDetalle.update((v) => !v);
    if (this.verDetalle()) {
      this.userService.getUser(id).subscribe({
        next: (value) => {
          this.dataForModal.set(value);
          console.log(value);
        },
      });
    }
  }

  /**PARA CREAR NUEVO USUARIO */
  isCreate = signal(false);
  toogleIsCreate() {
    this.isCreate.update((c) => !c);
  }

  handleRegister(event: RegisterData) {
    this.authService.registerNewUser(event).subscribe({
      next: (data) => {
        console.log(data);
        this.getUsuarios();
        this.isCreate.update((c) => !c);
      },
      error: (err) => {
        console.error(err);
        this.error.set(err);
      },
    });
  }

  /**PARA ACTUALIZAR USUARIO */
  isUpdateUser = signal(false);
  idUser = signal<bigint>(0n);
  toogleIsUpdate(id: bigint) {
    this.isUpdateUser.update((c) => !c);
    this.idUser.set(id);
  }

  handleUpdate(event: Usuario) {
    this.userService.updateUsuario(this.idUser(), event).subscribe({
      next: (data) => {
        console.log(data);
        this.getUsuarios();
        this.isUpdateUser.update((c) => !c);
      },
      error: (err) => {
        console.error(err);
        this.error.set(err);
      },
    });
  }

  /**ACTUALIZAR EL ROL DEL USUARIO */
  //Cambiar el estado de la incidencia
  isOpenRole = signal(false);
  private fb = inject(FormBuilder);
  formUpdateRole = this.fb.group({
    id: [0, [Validators.min(1)]],
    rol: ['', [Validators.required, Validators.minLength(4)]],
  });
  loadingRole = signal(false)
  rolesUsuario = signal<Rol []>([]);
  nombreUsuario = signal("");
  rolesTemplate:string[] = ['EMPLEADO', 'TECNICO_NIVEL_1', 'TECNICO_NIVEL_2', 'TECNICO_NIVEL_3'];

  openRole(usu : Usuario, id: bigint) {
    const ids = Number(id);
    this.formUpdateRole.patchValue({ id: ids });
    this.isOpenRole.update((i) => !i);
    this.rolesUsuario.set(usu.roles)
    this.nombreUsuario.set(usu.username)
  }

  submitChangeRole() {
    this.loadingRole.set(true)
    if (this.formUpdateRole.invalid) {
      this.formUpdateRole.markAllAsTouched();
      return;
    }
    const payload = this.formUpdateRole.getRawValue();
    const data: { id: number; rol: string } = {
      id: payload.id!,
      rol: payload.rol!,
    };

    this.userService.cambiarRol(data).subscribe({
      next: ( response ) => {
        this.loadingRole.set(false)
        this.formUpdateRole.reset();
        this.isOpenRole.set(false);
        this.getUsuarios();
      },
      error:(e)=> {
        console.log(e?.error.message);
      }
    });
  }
  convertirRole(a: Role){
    return convertirRol(a)
  }
}
