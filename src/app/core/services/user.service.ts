import { inject, Injectable, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { PaginatedResponse, Usuario } from '../models/usuario.model';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { ApiResponse } from '../models/auth.response';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly authService = inject(AuthService);
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8080/api/usuario';

  getUsers(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.apiUrl);
  }

  getUsersPaginados(page: number = 0, size: number = 4): Observable< PaginatedResponse<Usuario> > {
    let params = new HttpParams()
      .set('page', page)
      .set('size', size);
    return this.http.get< PaginatedResponse<Usuario> >(`${this.apiUrl}/paginado`, {params});
  }

  updateUsuario(id: bigint, usuario: Usuario){
    return this.http.put<Usuario>(`${this.apiUrl}/${id}`, usuario);
  }

  getUser(id: bigint){
    return this.http.get<Usuario>(`${this.apiUrl}/${id}`);
  }

  getUsuarioPrincipal(){
    const username = this.authService.currentUser()?.username;
    return this.http.get<Usuario>(`${this.apiUrl}/${username}/username`);
  }

  actualizarPerfil( usuario: {username: string, nombre: string, correo:string}){
    return this.http.post<Usuario>(`${this.apiUrl}/updatePerfil`, usuario);
  }

  cambiarRol(data:{id:number, rol: string}){
    return this.http.post<ApiResponse<Usuario>>(`${this.apiUrl}/${data.id}/role`, {role: data.rol});
  }

}
