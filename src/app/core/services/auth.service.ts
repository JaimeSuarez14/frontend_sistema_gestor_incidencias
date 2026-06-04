import { Injectable, signal, computed, inject } from '@angular/core';
import { User, LoginCredentials, RegisterData } from '../models/user.model';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { Decoded, LoginResponse } from '../models/auth.response';
import {jwtDecode } from "jwt-decode";

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http =  inject(HttpClient);
  private url = 'http://localhost:8080';

  private _currentUser = signal<User | null>(null);
  private _isAuthenticated = signal(false);

  readonly currentUser = this._currentUser.asReadonly();
  readonly isAuthenticated = this._isAuthenticated.asReadonly();
  readonly isAdmin = computed(() => this._currentUser()?.role[0] === 'ROLE_ADMIN');
  readonly isEmpleado = computed(() => this._currentUser()?.role[0] === 'ROLE_EMPLEADO');
  readonly isTecnico = computed(() => this._currentUser()?.role[0]?.startsWith('ROLE_TECNICO') ?? false);



  login(credentials: LoginCredentials){
    return this.http.post<LoginResponse>(`${this.url}/login`, credentials)
    .pipe(
      tap(response => {
        this.registerSession(response.token);

      })
    )
  }

  registerSession(token: string){
    localStorage.setItem("token", token);
    const decoded: Decoded = jwtDecode(token);
    console.log(decoded);

    this._currentUser.update(u => u !=null ? { ...u  ,  username : decoded.sub , role: decoded.authorities } : null)
    this._isAuthenticated.set(true);
  }

  logout(): void {screen
    this._currentUser.set(null);
    this._isAuthenticated.set(false);
  }




}
