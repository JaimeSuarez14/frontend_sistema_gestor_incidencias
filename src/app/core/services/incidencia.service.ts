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

  public getIncidencias(page: number = 0, size: number = 5, texto: string = '') {
    let params = new HttpParams().set('page', page).set('size', size).set('texto', texto);
    return this.http.get<PaginatedResponse<Incidencia>>(this.apiUrl + '/paginado', { params }).pipe(
      tap((data) => {
        const response = data.content.map((d) => ({
          ...d,
          fechaCreacion: new Date(d.fechaCreacion),
        }));
        this._incidencias.set(response);
      }),
    );
  }

  public createIncidencia(data: any) {
    return this.http.post<Incidencia>(this.apiUrl, data);
  }

  //recibe tanto las pagina, cantidad por pagina, busqueda
  public misIncidencias(page: number = 0, size: number = 6, texto: string = '') {
    let params = new HttpParams().set('page', page).set('size', size).set('texto', texto);
    return this.http
      .get<PaginatedResponse<Incidencia>>(this.apiUrl + '/incidenciasPropias', { params })
      .pipe(
        tap((data) => {
          const response = data.content.map((d) => ({
            ...d,
            fechaCreacion: new Date(d.fechaCreacion),
          }));
          this._incidencias.set(response);
        }),
      );
  }

  public cambiarEstado(data: { idIncidencia: number; estado: string }) {
    return this.http.post<Incidencia>(`${this.apiUrl}/actualizarEstado`, data);
  }

  public cambiarTecnico(data: { idIncidencia: number; idTecnico: number }) {
    return this.http.post<Incidencia>(`${this.apiUrl}/actualizarTecnico`, data);
  }
}
