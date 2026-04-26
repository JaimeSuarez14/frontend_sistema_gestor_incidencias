import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IncidentService } from '../../core/services/incident.service';
import { UserService } from '../../core/services/user.service';

@Component({
  selector: 'app-incidents',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './incidents.component.html'
})
export class IncidentsComponent {
  incidentService = inject(IncidentService);
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
}
