import { inject, Injectable, signal } from '@angular/core';
import { User } from '../models/user.model';
import { HttpClient } from '@angular/common/http';
import { Usuario } from '../models/usuario.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8080/api/usuario';

  private readonly _users = signal<User[]>([
    {
      id: '1',
      name: 'Juan Pérez',
      email: 'juan.perez@empresa.com',
      role: 'ADMIN',
      estado: 'ACTIVO',
    },
    {
      id: '2',
      name: 'María López',
      email: 'maria.lopez@gmail.com',
      role: 'TECNICO_NIVEL_1',
      estado: 'ACTIVO',
    },
    {
      id: '3',
      name: 'Carlos Ramírez',
      email: 'carlos.ramirez@uducad.com',
      role: 'EMPLEADO',
      estado: 'ACTIVO',
    },
    {
      id: '4',
      name: 'Ana Torres',
      email: 'ana.torres@hotmail.com',
      role: 'TECNICO_NIVEL_1',
      estado: 'ACTIVO',
    },
    {
      id: '5',
      name: 'Luis Fernández',
      email: 'luis.fernandez@outlook.com',
      role: 'EMPLEADO',
      estado: 'ACTIVO',
    },
  ]);

  readonly users = this._users.asReadonly();

  getUserById(id: string): User | undefined {
    return this._users().find((u) => u.id === id);
  }

  getUsers(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.apiUrl);
  }
}
