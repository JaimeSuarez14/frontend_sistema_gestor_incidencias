import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IncidenciaService } from '../../core/services/incident.service';
import { UserService } from '../../core/services/user.service';
import { BuscadorComponent } from '../../shared/components/buscador/buscador.component';
import { Incidencia } from '../../core/models/incident.model';
import { DetalleIncidencia } from "./detalle-incidencia/detalle-incidencia";
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-incidents',
  standalone: true,
  imports: [CommonModule, DetalleIncidencia, RouterLink, BuscadorComponent],
  templateUrl: './incidencia.component.html'
})
export class IncidenciaComponent {
  incidentService = inject(IncidenciaService);
  userService = inject(UserService);

  filteredIncidents = signal<Incidencia[]>([]);

  constructor() {
    this.filteredIncidents.set(this.incidentService.incidents());
  }

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      'open': 'Abierta',
      'in_progress': 'En Progreso',
      'closed': 'Cerrada'
    };
    return labels[status] || status;
  }

  getPriorityLabel(priority: string): string {
    const labels: Record<string, string> = {
      'high': 'Alta',
      'medium': 'Media',
      'low': 'Baja'
    };
    return labels[priority] || priority;
  }

  getUserName(userId: string): string {
    const user = this.userService.getUserById(userId);
    return user?.name || 'Sin asignar';
  }

  verDetalle = signal(false);
  idIncidencia = signal<number | null>(null);

  onSearchResults(results: Incidencia[]): void {
    this.filteredIncidents.set(results);
  }

  openModal(id: number): void {
    this.verDetalle.update(v => !v);
    this.idIncidencia.set(id);
  }
}
