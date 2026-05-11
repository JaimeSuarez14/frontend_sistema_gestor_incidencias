import { Component, inject, linkedSignal, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../core/services/user.service';
import { BuscadorComponent } from '../../shared/components/buscador/buscador.component';
import { User } from '../../core/models/user.model';
import { Usuario } from 'src/app/core/models/usuario.model';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, BuscadorComponent],
  templateUrl: './users.component.html',
})
export class UsersComponent implements OnInit{
  userService = inject(UserService);
  usuarios = signal< Usuario []>([]);
  loading = signal ( true );
  error = signal ( '' );
  filteredUsers = linkedSignal<Usuario[]>(
    () => this.usuarios()
  );

  constructor() {

  }

  ngOnInit(): void {
    this.userService.getUsers().subscribe(
      {
        next:(data => { this.usuarios.set(data); this.loading.set(false) }),
        error:(err => {
          console.error(err);
          this.error.set(err);
          this.loading.set(false);
        })
      }
    )
  }

  getRoleLabel(role: string): string {
    const labels: Record<string, string> = {
      TECNICO_NIVEL_1: 'Técnico Nivel 1',
      EMPLEADO: 'Empleado'
    };
    return labels[role] || role;
  }

  onSearchResults(results: Usuario[]): void {
    this.filteredUsers.set(results);
  }
}
