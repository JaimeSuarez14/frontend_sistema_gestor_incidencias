import { PerfilUsuario } from './../../features/perfil-usuario/perfil-usuario';
import { Injectable, signal, computed, inject } from '@angular/core';
import { CurrentUser, LoginCredentials, RegisterData } from '../models/usuario.model';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { ApiResponse, Decoded, LoginResponse, UsuarioResponseDto } from '../models/auth.response';
import { jwtDecode } from 'jwt-decode';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private url = 'http://localhost:8080';

  private _currentUser = signal<CurrentUser | null>(null);
  private _isAuthenticated = signal(false);

  readonly currentUser = this._currentUser.asReadonly();
  readonly isAuthenticated = this._isAuthenticated.asReadonly();
  readonly isAdmin = computed(() => this._currentUser()?.roles.includes('ROLE_ADMIN'));
  readonly isEmpleado = computed(() => this._currentUser()?.roles.includes('ROLE_EMPLEADO'));
  readonly isTecnico = computed(
    () => this._currentUser()?.roles[0]?.startsWith('ROLE_TECNICO') ?? false,
  );

  constructor() {
    const token = localStorage.getItem('token');
    if (token) {
      this.registerSession(token);
    }
  }

  login(credentials: LoginCredentials) {
    return this.http.post<LoginResponse>(`${this.url}/login`, credentials).pipe(
      tap((response) => {
        this.registerSession(response.token);
      }),
    );
  }

  registerSession(token: string) {
    localStorage.setItem('token', token);
    const decoded: Decoded = jwtDecode(token);
    console.log(decoded);
    this._currentUser.set({ username: decoded.sub, roles: decoded.authorities });
    this._isAuthenticated.set(true);
    console.log(this.isAdmin());
    console.log(this._currentUser());
  }

  logout(): void {
    screen;
    this._currentUser.set(null);
    this._isAuthenticated.set(false);
    localStorage.removeItem('token');
  }

  registerNewUser(newUser: RegisterData): Observable<ApiResponse<UsuarioResponseDto>> {
    return this.http.post<ApiResponse<UsuarioResponseDto>>(
      `${this.url}/api/auth/register`,
      newUser,
    );
  }

  verificarUsername(username : String ){
    return this.http.get<boolean>(this.url+username).pipe(e => e)
  }
}
