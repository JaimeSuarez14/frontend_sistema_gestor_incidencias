import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  template: `
    <div class="min-h-screen bg-gray-100">
      <nav class="bg-indigo-600 text-white p-4">
        <div class="container mx-auto flex justify-between items-center">
          <h1 class="text-xl font-bold">Sistema Gestor de Incidencias</h1>
          <div class="flex items-center gap-4">
            <span>{{ authService.currentUser()?.name }}</span>
            <button
              (click)="logout()"
              class="bg-indigo-700 hover:bg-indigo-800 px-4 py-2 rounded-lg transition-colors"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </nav>
      <div class="container mx-auto p-6">
        <h2 class="text-2xl font-semibold text-gray-800 mb-4">Bienvenido al Dashboard</h2>
        <p class="text-gray-600">Aquí irán las métricas y gestión de incidencias.</p>
      </div>
    </div>
  `,
})
export class DashboardComponent {
  constructor(public authService: AuthService, private router: Router) {}

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}