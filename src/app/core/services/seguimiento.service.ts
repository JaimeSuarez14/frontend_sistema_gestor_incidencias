import { SeguimientoDTO } from './../models/seguimiento.model';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { SeguimientoResponseDto } from '../models/seguimiento.model';

@Injectable({ providedIn: 'root' })
export class SeguimientoService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8080/api/seguimiento';

  obtenerMisSeguimientos(id: number){
    return this.http.get<SeguimientoResponseDto[]>(`${this.apiUrl}/${id}/seguimientos`)
  }

  crearSeguimiento(data:SeguimientoDTO){
    return this.http.post<SeguimientoResponseDto>(`${this.apiUrl}`, data);
  }
}
