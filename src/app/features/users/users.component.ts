import { Component, effect, inject, linkedSignal, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '@services/user.service';
import { Page, RegisterData, Role, Usuario } from 'src/app/core/models/usuario.model';
import { BuscadorComponent } from 'src/app/shared/components/buscador/buscador.component';
import { ModalGeneric } from '@shared/components/modal-generic/modal-generic';
import { UserFormComponent } from "@shared/components/user-form-component/user-form-component";

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, BuscadorComponent, ModalGeneric, UserFormComponent],
  templateUrl: './users.component.html',
})
export class UsersComponent implements OnInit {
  userService = inject(UserService);
  usuarios = signal<Usuario[]>([]);
  loading = signal(true);
  error = signal('');
  filteredUsers = linkedSignal<Usuario[]>(() => this.usuarios());

  constructor() {
    effect(() => {
      this.getUsuarios();
    });
  }

  ngOnInit(): void {}

  onSearchResults(results: Usuario[]): void {
    this.filteredUsers.set(results);
  }

  pageCurrent = signal(0);
  page = signal<Page | null>(null);
  size = signal(5);

  getUsuarios(): void {
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

  onPageChange(pagina: number) {
    this.pageCurrent.set(pagina);
  }

  onChangeNumberPorPagina(e: Event) {}

  botones = computed(() => {
    const total = this.page()?.totalPages || 1;
    if (total <= 3) {
      const paginas = Array.from({ length: total }, (_, i) => i);
      return { paginas, total };
    }

    return { paginas: [0, 1, 2], total };
  });

  openModal() {}

  isCreate = signal(false);
  toogleIsCreate() {
    this.isCreate.update((c) => !c);
  }

  handleRegister(event: RegisterData){
    console.log(event);

  }
}
