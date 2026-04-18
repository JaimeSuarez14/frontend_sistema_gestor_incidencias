import { Injectable, signal, computed } from '@angular/core';
import { User, LoginCredentials, RegisterData } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _currentUser = signal<User | null>(null);
  private _isAuthenticated = signal(false);

  readonly currentUser = this._currentUser.asReadonly();
  readonly isAuthenticated = this._isAuthenticated.asReadonly();
  readonly isAdmin = computed(() => this._currentUser()?.role === 'admin');

  private readonly MOCK_USERS: (User & { password: string })[] = [
    { id: '1', email: 'admin@test.com', password: 'admin123', name: 'Administrador', role: 'admin' },
    { id: '2', email: 'user@test.com', password: 'user123', name: 'Usuario Test', role: 'user' },
    { id: '3', email: 'tecnico@test.com', password: 'tec123', name: 'Técnico Test', role: 'tecnico' },
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
      role: 'user',
    };

    this.MOCK_USERS.push({ ...newUser, password: data.password });
    return newUser;
  }

  logout(): void {
    this._currentUser.set(null);
    this._isAuthenticated.set(false);
  }
}