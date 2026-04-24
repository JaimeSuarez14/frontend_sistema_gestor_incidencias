import { Injectable, signal, computed } from '@angular/core';
import { User, LoginCredentials, RegisterData } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _currentUser = signal<User | null>(null);
  private _isAuthenticated = signal(false);

  readonly currentUser = this._currentUser.asReadonly();
  readonly isAuthenticated = this._isAuthenticated.asReadonly();
  readonly isAdmin = computed(() => this._currentUser()?.role === 'ADMIN');

  private readonly MOCK_USERS: (User & { password: string })[] = [
    { id: "1", email: 'juan.perez@empresa.com', password: 'admin123', name: 'Juan Pérez', estado : "ACTIVO" , role: 'ADMIN' },
    { id: "2", email: 'maria.lopez@empresa.com', password: 'support123', name: 'María López',estado : "ACTIVO" , role: 'TECNICO_NIVEL_1' },
    { id: "3", email: 'carlos.ramirez@empresa.com', password: 'user123', name: 'Carlos Ramírez', estado : "ACTIVO" , role: 'ADMIN' },
    { id: "4", email: 'ana.torres@empresa.com', password: 'support123', name: 'Ana Torres',estado : "ACTIVO" , role: 'ADMIN' },
    { id: "5", email: 'luis.fernandez@empresa.com', password: 'user123', name: 'Luis Fernández', estado : "ACTIVO" ,role: 'EMPLEADO' },
  ];

  login(credentials: LoginCredentials): boolean {
    const user = this.MOCK_USERS.find(
      (u) => u.email === credentials.email && u.password === credentials.password
    );

    if (user) {
      const { password: _, ...userWithoutPassword } = user;
      this._currentUser.set(userWithoutPassword);
      this._isAuthenticated.set(true);
      return true;
    }
    return false;
  }

  logout(): void {screen
    this._currentUser.set(null);
    this._isAuthenticated.set(false);
  }

  getUserById(id: string): User | undefined {
    return this.MOCK_USERS.find(u => u.id === id);
  }

  register(data: RegisterData): User | null {
    if (data.password !== data.confirmPassword) {
      return null;
    }

    const exists = this.MOCK_USERS.find((u) => u.email === data.email);
    if (exists) {
      return null;
    }

    const newUser: User = {
      id: crypto.randomUUID(),
      email: data.email,
      name: data.name,
      estado: "ACTIVO",
      role: 'EMPLEADO',
    };

    this.MOCK_USERS.push({ ...newUser, password: data.password });
    return newUser;
  }
}
