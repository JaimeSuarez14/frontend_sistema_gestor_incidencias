import { Component, inject } from '@angular/core';
import { IncidenciaService } from '@services/incidencia.service';
import { UserService } from '@services/user.service';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-admin',
  imports: [RouterLink, CommonModule],
  templateUrl: './admin.html',
  styleUrl: './admin.css',
})
export class Admin {
  incidentService = inject(IncidenciaService);
  userService = inject(UserService);

  constructor(){
    this.incidentService.getIncidencias().subscribe();
  }

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

  getUserName(userId: bigint): string {
       return 'Sin asignar';
  }

  getPriorityPercentage(priority: 'high' | 'medium' | 'low'): number {
    return 0;
  }
}
