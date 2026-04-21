import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IncidentService } from '../../core/services/incident.service';
import { UserService } from '../../core/services/user.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ RouterLink],
  template: `
    <div class="space-y-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p class="text-gray-500">Resumen del sistema de incidencias</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500">Total Incidencias</p>
              <p class="text-3xl font-bold text-gray-900">{{ incidentService.totalIncidents() }}</p>
            </div>
            <div class="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500">Abiertas</p>
              <p class="text-3xl font-bold text-red-600">{{ incidentService.openIncidents() }}</p>
            </div>
            <div class="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500">En Progreso</p>
              <p class="text-3xl font-bold text-amber-600">{{ incidentService.inProgressIncidents() }}</p>
            </div>
            <div class="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500">Cerradas</p>
              <p class="text-3xl font-bold text-green-600">{{ incidentService.closedIncidents() }}</p>
            </div>
            <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Incidencias por Estado</h2>
          <div class="flex items-center justify-center h-48">
            <div class="flex gap-8">
              <div class="text-center">
                <div class="w-20 h-20 rounded-full border-4 border-red-500 flex items-center justify-center mb-2">
                  <span class="text-xl font-bold text-red-600">{{ incidentService.incidentsByStatus().open }}</span>
                </div>
                <span class="text-sm text-gray-500">Abiertas</span>
              </div>
              <div class="text-center">
                <div class="w-20 h-20 rounded-full border-4 border-amber-500 flex items-center justify-center mb-2">
                  <span class="text-xl font-bold text-amber-600">{{ incidentService.incidentsByStatus().in_progress }}</span>
                </div>
                <span class="text-sm text-gray-500">En Progreso</span>
              </div>
              <div class="text-center">
                <div class="w-20 h-20 rounded-full border-4 border-green-500 flex items-center justify-center mb-2">
                  <span class="text-xl font-bold text-green-600">{{ incidentService.incidentsByStatus().closed }}</span>
                </div>
                <span class="text-sm text-gray-500">Cerradas</span>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Incidencias por Prioridad</h2>
          <div class="space-y-4">
            <div>
              <div class="flex justify-between mb-1">
                <span class="text-sm font-medium text-gray-700">Alta</span>
                <span class="text-sm font-medium text-red-600">{{ incidentService.incidentsByPriority().high }}</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2.5">
                <div class="bg-red-500 h-2.5 rounded-full" [style.width.%]="getPriorityPercentage('high')"></div>
              </div>
            </div>
            <div>
              <div class="flex justify-between mb-1">
                <span class="text-sm font-medium text-gray-700">Media</span>
                <span class="text-sm font-medium text-amber-600">{{ incidentService.incidentsByPriority().medium }}</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2.5">
                <div class="bg-amber-500 h-2.5 rounded-full" [style.width.%]="getPriorityPercentage('medium')"></div>
              </div>
            </div>
            <div>
              <div class="flex justify-between mb-1">
                <span class="text-sm font-medium text-gray-700">Baja</span>
                <span class="text-sm font-medium text-blue-600">{{ incidentService.incidentsByPriority().low }}</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2.5">
                <div class="bg-blue-500 h-2.5 rounded-full" [style.width.%]="getPriorityPercentage('low')"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-gray-900">Incidencias Recientes</h2>
          <a routerLink="/incidents" class="text-sm text-indigo-600 hover:text-indigo-700">Ver todas</a>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="border-b border-gray-200">
                <th class="text-left py-3 px-4 text-sm font-medium text-gray-500">ID</th>
                <th class="text-left py-3 px-4 text-sm font-medium text-gray-500">Título</th>
                <th class="text-left py-3 px-4 text-sm font-medium text-gray-500">Estado</th>
                <th class="text-left py-3 px-4 text-sm font-medium text-gray-500">Prioridad</th>
                <th class="text-left py-3 px-4 text-sm font-medium text-gray-500">Asignado a</th>
                <th class="text-left py-3 px-4 text-sm font-medium text-gray-500">Fecha</th>
              </tr>
            </thead>
            <tbody>
              @for (incident of incidentService.recentIncidents(); track incident.id) {
                <tr class="border-b border-gray-100 hover:bg-gray-50">
                  <td class="py-3 px-4 text-sm text-gray-900">#{{ incident.id }}</td>
                  <td class="py-3 px-4 text-sm text-gray-900">{{ incident.title }}</td>
                  <td class="py-3 px-4">
                    <span
                      class="px-2 py-1 text-xs font-medium rounded-full"
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
                  <td class="py-3 px-4">
                    <span
                      class="px-2 py-1 text-xs font-medium rounded-full"
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
                  <td class="py-3 px-4 text-sm text-gray-600">{{ getUserName(incident.assignedTo) }}</td>
                  <td class="py-3 px-4 text-sm text-gray-600">{{ incident.createdAt }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent {
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

  getPriorityPercentage(priority: 'high' | 'medium' | 'low'): number {
    const total = this.incidentService.totalIncidents();
    if (total === 0) return 0;
    return (this.incidentService.incidentsByPriority()[priority] / total) * 100;
  }
}
