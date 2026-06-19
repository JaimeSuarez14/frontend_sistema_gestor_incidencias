import { Component, effect, inject, linkedSignal, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '@services/user.service';
import { Page, RegisterData, Role, Usuario } from 'src/app/core/models/usuario.model';
import { BuscadorComponent } from 'src/app/shared/components/buscador/buscador.component';
import { ModalGeneric } from '@shared/components/modal-generic/modal-generic';
import { UserFormComponent } from "@shared/components/user-form-component/user-form-component";
import { UpdateUserForm } from "./update-user-form/update-user-form";
import { AuthService } from '@services/auth.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, BuscadorComponent, ModalGeneric, UserFormComponent, UpdateUserForm],
  templateUrl: './users.component.html',
})
export class UsersComponent {
  userService = inject(UserService);
  authService = inject(AuthService)
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
  openModal() {}

  /**PARA CREAR NUEVO USUARIO */
  isCreate = signal(false);
  toogleIsCreate() {
    this.isCreate.update((c) => !c);
  }

  handleRegister(event: RegisterData){
    this.authService.registerNewUser( event).subscribe({
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
  idUser = signal<bigint >(0n);
  toogleIsUpdate(id:bigint) {
    this.isUpdateUser.update((c) => !c);
    this.idUser.set(id);
  }

  handleUpdate(event: Usuario){
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
}
