import { Component, computed, inject, output } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { SessionThema } from 'src/app/shared/utils/session-tema';
import { convertirRol } from '@shared/utils/convertidoFunction';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header-dashboard.component.html',
})
export class HeaderDashboardComponent {
  toggleSidebar = output<void>();
  router = inject(Router);
  sessionThema = inject(SessionThema);

  constructor(public authService: AuthService) {}

  cerrarSession() {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }

  rol = computed(() => {
    if (this.authService.currentUser()?.roles[0]) {
      return convertirRol(this.authService.currentUser()?.roles[0]!);
    }
    return "Sin Rol"
  });
}
