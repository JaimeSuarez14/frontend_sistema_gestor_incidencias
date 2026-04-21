import { Injectable, signal, computed } from '@angular/core';
import { Incident } from '../models/incident.model';

@Injectable({ providedIn: 'root' })
export class IncidentService {
  private readonly _incidents = signal<Incident[]>([
    { id: 101, title: 'Error en login', description: 'Usuarios no pueden iniciar sesión', status: 'open', priority: 'high', assignedTo: "2", createdAt: '2026-04-15' },
    { id: 102, title: 'Página lenta', description: 'El dashboard carga muy lento', status: 'in_progress', priority: 'medium', assignedTo: "4", createdAt: '2026-04-14' },
    { id: 103, title: 'Error 500 en API', description: 'Falla en endpoint de usuarios', status: 'closed', priority: 'high', assignedTo: "2", createdAt: '2026-04-13' },
    { id: 104, title: 'Problema de UI', description: 'Botón no responde en mobile', status: 'open', priority: 'low', assignedTo: "4", createdAt: '2026-04-12' },
    { id: 105, title: 'Datos no sincronizados', description: 'Información desactualizada', status: 'in_progress', priority: 'high', assignedTo: "2", createdAt: '2026-04-11' },
    { id: 106, title: 'Error en reportes', description: 'No se generan PDFs', status: 'closed', priority: 'medium', assignedTo: "4", createdAt: '2026-04-10' },
    { id: 107, title: 'Fallo en notificaciones', description: 'No llegan correos', status: 'open', priority: 'high', assignedTo: "2", createdAt: '2026-04-09' },
  ]);

  readonly incidents = this._incidents.asReadonly();

  readonly totalIncidents = computed(() => this._incidents().length);
  readonly openIncidents = computed(() => this._incidents().filter(i => i.status === 'open').length);
  readonly inProgressIncidents = computed(() => this._incidents().filter(i => i.status === 'in_progress').length);
  readonly closedIncidents = computed(() => this._incidents().filter(i => i.status === 'closed').length);

  readonly incidentsByStatus = computed(() => ({
    open: this._incidents().filter(i => i.status === 'open').length,
    in_progress: this._incidents().filter(i => i.status === 'in_progress').length,
    closed: this._incidents().filter(i => i.status === 'closed').length,
  }));

  readonly incidentsByPriority = computed(() => ({
    high: this._incidents().filter(i => i.priority === 'high').length,
    medium: this._incidents().filter(i => i.priority === 'medium').length,
    low: this._incidents().filter(i => i.priority === 'low').length,
  }));

  readonly recentIncidents = computed(() =>
    [...this._incidents()].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5)
  );
}
