import { Component, signal } from '@angular/core';
import { SidebarDashboardComponent } from '../sidebar/sidebar-dashboard.component';
import { HeaderDashboardComponent } from '../header/header-dashboard.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [SidebarDashboardComponent, HeaderDashboardComponent, RouterOutlet],
  template: `
    <div class="min-h-screen bg-gray-50">
      <app-sidebar [(collapsed)]="sidebarCollapsed" />
      <div
        [class]="
          (sidebarCollapsed() ? 'pl-16' : 'pl-64') + ' transition-all transform duration-300 ease-in-out'
        "
      >
        <app-header (toggleSidebar)="toggleSidebar()" />
        <main class="">
          <router-outlet />
        </main>
      </div>
    </div>
  `,
})
export class MainLayoutComponent {
  sidebarCollapsed = signal(false);

  toggleSidebar(): void {
    this.sidebarCollapsed.update((v) => !v);
  }
}
