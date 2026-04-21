import { Component, signal } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { HeaderComponent } from '../header/header.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [SidebarComponent, HeaderComponent, RouterOutlet],
  template: `
    <div class="min-h-screen bg-gray-50">
      <app-sidebar [(collapsed)]="sidebarCollapsed" />

      <div
        [class]="
          (sidebarCollapsed() ? 'pl-16' : 'pl-64') + ' transition-all transform duration-300 ease-in-out'
        "
      >
        <app-header (toggleSidebar)="toggleSidebar()" />

        <main class="p-6">
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
