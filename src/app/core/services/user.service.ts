import { Injectable, signal } from '@angular/core';
import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly _users = signal<User[]>([
    { id: "1", name: 'Juan Pérez', email: 'juan.perez@empresa.com', role: 'admin' },
    { id: "2", name: 'María López', email: 'maria.lopez@empresa.com', role: 'support' },
    { id: "3", name: 'Carlos Ramírez', email: 'carlos.ramirez@empresa.com', role: 'user' },
    { id: "4", name: 'Ana Torres', email: 'ana.torres@empresa.com', role: 'support' },
    { id: "5", name: 'Luis Fernández', email: 'luis.fernandez@empresa.com', role: 'user' },
  ]);

  readonly users = this._users.asReadonly();

  getUserById(id: string): User | undefined {
    return this._users().find(u => u.id === id);
  }
}
