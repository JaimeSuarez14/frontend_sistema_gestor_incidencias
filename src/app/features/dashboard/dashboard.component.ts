import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IncidentService } from '../../core/services/incident.service';
import { UserService } from '../../core/services/user.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {
  incidentService = inject(IncidentService);
  userService = inject(UserService);

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      open: 'Abierta',
      in_progress: 'En Progreso',
      closed: 'Cerrada',
    };
    return labels[status] || status;
  }

  getPriorityLabel(priority: string): string {
    const labels: Record<string, string> = {
      high: 'Alta',
      medium: 'Media',
      low: 'Baja',
    };
    return labels[priority] || priority;
  }

  getUserName(userId: string): string {
    const user = this.userService.getUserById(userId);
    return user?.name || 'Sin asignar';
  }

  getPriorityPercentage(priority: 'high' | 'medium' | 'low'): number {
    const total = this.incidentService.totalIncidents();
    if (total === 0) return 0;
    return (this.incidentService.incidentsByPriority()[priority] / total) * 100;
  }
}
