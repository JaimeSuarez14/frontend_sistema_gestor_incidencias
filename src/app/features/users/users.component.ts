import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../core/services/user.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Usuarios</h1>
        <p class="text-gray-500">Gestión de usuarios del sistema</p>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="bg-gray-50 border-b border-gray-200">
                <th class="text-left py-4 px-6 text-sm font-medium text-gray-500">ID</th>
                <th class="text-left py-4 px-6 text-sm font-medium text-gray-500">Nombre</th>
                <th class="text-left py-4 px-6 text-sm font-medium text-gray-500">Email</th>
                <th class="text-left py-4 px-6 text-sm font-medium text-gray-500">Rol</th>
              </tr>
            </thead>
            <tbody>
              @for (user of userService.users(); track user.id) {
                <tr class="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td class="py-4 px-6 text-sm text-gray-900">{{ user.id }}</td>
                  <td class="py-4 px-6">
                    <div class="flex items-center gap-3">
                      <div class="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                        <span class="text-indigo-600 font-medium">{{ user.name.charAt(0) }}</span>
                      </div>
                      <span class="text-sm font-medium text-gray-900">{{ user.name }}</span>
                    </div>
                  </td>
                  <td class="py-4 px-6 text-sm text-gray-600">{{ user.email }}</td>
                  <td class="py-4 px-6">
                    <span
                      class="px-3 py-1 text-xs font-medium rounded-full"
                      [class.bg-indigo-100]="user.role === 'ADMIN'"
                      [class.text-indigo-700]="user.role === 'ADMIN'"
                      [class.bg-blue-100]="user.role === 'TECNICO_NIVEL_1' "
                      [class.text-blue-700]="user.role === 'TECNICO_NIVEL_1'"
                      [class.bg-gray-100]="user.role === 'EMPLEADO'"
                      [class.text-gray-700]="user.role === 'EMPLEADO'"
                    >
                      {{ getRoleLabel(user.role) }}
                    </span>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class UsersComponent {
  userService = inject(UserService);

  getRoleLabel(role: string): string {
    const labels: Record<string, string> = {
      'admin': 'Administrador',
      'support': 'Soporte',
      'user': 'Usuario'
    };
    return labels[role] || role;
  }
}
