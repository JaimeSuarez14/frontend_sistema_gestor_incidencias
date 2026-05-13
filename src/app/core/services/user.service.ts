import { inject, Injectable, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { PaginatedResponse, Usuario } from '../models/usuario.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserService {
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
}
