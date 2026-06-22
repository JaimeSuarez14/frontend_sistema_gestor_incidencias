import { Injectable, signal, computed, inject } from '@angular/core';
import { Incidencia } from '../models/incident.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { PaginatedResponse } from '../models/usuario.model';
import { tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class IncidenciaService {
  private http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8080/api/incidencia';
  private readonly _incidencias = signal<Incidencia[]>([]);
  readonly incidencias = this._incidencias.asReadonly();

  public getIncidencia(id: number) {
    return this.http.get<Incidencia>(this.apiUrl + '/' + id);
  }

  getIncidencias(page: number = 0, size: number = 4) {
    let params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<PaginatedResponse<Incidencia>>(this.apiUrl + '/paginado', { params }).pipe(
      tap((data) => {
        this._incidencias.set(data.content);
      }),
    );
  }

  public createIncidencia(data: any) {
    return this.http.post<Incidencia>(this.apiUrl, data);
  }
}
