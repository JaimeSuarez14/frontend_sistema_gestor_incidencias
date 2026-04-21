import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IncidentService } from '../../core/services/incident.service';
import { UserService } from '../../core/services/user.service';

@Component({
  selector: 'app-incidents',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Incidencias</h1>
        <p class="text-gray-500">Listado completo de incidencias</p>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="bg-gray-50 border-b border-gray-200">
                <th class="text-left py-4 px-6 text-sm font-medium text-gray-500">ID</th>
                <th class="text-left py-4 px-6 text-sm font-medium text-gray-500">Título</th>
                <th class="text-left py-4 px-6 text-sm font-medium text-gray-500">Descripción</th>
                <th class="text-left py-4 px-6 text-sm font-medium text-gray-500">Estado</th>
                <th class="text-left py-4 px-6 text-sm font-medium text-gray-500">Prioridad</th>
                <th class="text-left py-4 px-6 text-sm font-medium text-gray-500">Asignado a</th>
                <th class="text-left py-4 px-6 text-sm font-medium text-gray-500">Fecha</th>
              </tr>
            </thead>
            <tbody>
              @for (incident of incidentService.incidents(); track incident.id) {
                <tr class="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td class="py-4 px-6 text-sm font-medium text-gray-900">#{{ incident.id }}</td>
                  <td class="py-4 px-6 text-sm text-gray-900">{{ incident.title }}</td>
                  <td class="py-4 px-6 text-sm text-gray-600 max-w-xs truncate">{{ incident.description }}</td>
                  <td class="py-4 px-6">
                    <span
                      class="px-3 py-1 text-xs font-medium rounded-full"
                      [class.bg-red-100]="incident.status === 'open'"
                      [class.text-red-700]="incident.status === 'open'"
                      [class.bg-amber-100]="incident.status === 'in_progress'"
                      [class.text-amber-700]="incident.status === 'in_progress'"
                      [class.bg-green-100]="incident.status === 'closed'"
                      [class.text-green-700]="incident.status === 'closed'"
                    >
                      {{ getStatusLabel(incident.status) }}
                    </span>
                  </td>
                  <td class="py-4 px-6">
                    <span
                      class="px-3 py-1 text-xs font-medium rounded-full"
                      [class.bg-red-100]="incident.priority === 'high'"
                      [class.text-red-700]="incident.priority === 'high'"
                      [class.bg-amber-100]="incident.priority === 'medium'"
                      [class.text-amber-700]="incident.priority === 'medium'"
                      [class.bg-blue-100]="incident.priority === 'low'"
                      [class.text-blue-700]="incident.priority === 'low'"
                    >
                      {{ getPriorityLabel(incident.priority) }}
                    </span>
                  </td>
                  <td class="py-4 px-6 text-sm text-gray-600">{{ getUserName(incident.assignedTo) }}</td>
                  <td class="py-4 px-6 text-sm text-gray-600">{{ incident.createdAt }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
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
