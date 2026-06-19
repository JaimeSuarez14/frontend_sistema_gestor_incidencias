import { Incidencia } from './../../../core/models/incident.model';
import { Component, computed, effect, inject, input, model, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IncidenciaService } from '@services/incident.service';
import { UserService } from '@services/user.service';

@Component({
  selector: 'app-detalle-incidencia',
  imports: [RouterLink],
  templateUrl: './detalle-incidencia.html',
  styleUrl: './detalle-incidencia.css',
})
export class DetalleIncidencia<T extends Record<string, any>> {
  modal = model(false);
  items = input<{ t: T; clave: string }>();
  idEntity = model<number | null>(0);
  searchFields = input<(keyof T)[]>([]);
  error = signal('');
  entidadRecibida = signal<null | any>(null);
  campos = computed(() => {
    const entidad = this.entidadRecibida();
    if (!entidad) return [];
    return this.searchFields().map((key) => ({
      label: String(key),
      value: entidad[key],
    }));
  });
  incidentService = inject(IncidenciaService);
  usuarioService = inject(UserService);

  constructor() {
    effect(() => {
      const item = this.items();
      const id = this.idEntity();
      if (item && item.clave === 'incidencia' && id && id != 0) {
        this.incidentService.getIncidencia(id).subscribe({
          next: (value) => {
            this.entidadRecibida.set(value);
          },
          error: (err) => {
            this.error.set(err);
          },
        });
      }
      if (item && item.clave === 'usuario' && id && id != 0) {
        this.usuarioService.getUser(BigInt(id)).subscribe({
          next: (value) => {
            this.entidadRecibida.set(value);
          },
          error: (err) => {
            this.error.set(err);
          },
        });
      }
    });
  }

  openBox() {
    this.modal.update((m) => !m);
  }
}
