import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IncidenciaService } from '../../core/services/incident.service';
import { UserService } from '../../core/services/user.service';
import { DetalleIncidencia } from "./detalle-incidencia/detalle-incidencia";

@Component({
  selector: 'app-incidents',
  standalone: true,
  imports: [CommonModule, DetalleIncidencia],
  templateUrl: './incidencia.component.html'
})
export class IncidenciaComponent {
  incidentService = inject(IncidenciaService);
  userService = inject(UserService);

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
}
