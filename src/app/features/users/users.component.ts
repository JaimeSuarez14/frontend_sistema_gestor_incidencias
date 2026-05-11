import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../core/services/user.service';
import { BuscadorComponent } from '../../shared/components/buscador/buscador.component';
import { User } from '../../core/models/user.model';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, BuscadorComponent],
  templateUrl: './users.component.html',
})
export class UsersComponent implements OnInit{
  userService = inject(UserService);
  filteredUsers = signal<User[]>([]);

  constructor() {
    this.filteredUsers.set(this.userService.users());
  }

  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  getRoleLabel(role: string): string {
    const labels: Record<string, string> = {
      admin: 'Administrador',
      support: 'Soporte',
      user: 'Usuario',
      ADMIN: 'Administrador',
      TECNICO_NIVEL_1: 'Técnico Nivel 1',
      EMPLEADO: 'Empleado'
    };
    return labels[role] || role;
  }

  onSearchResults(results: User[]): void {
    this.filteredUsers.set(results);
  }
}
