import { Component, inject, output } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { SessionThema } from 'src/app/shared/utils/session-tema';

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
}
