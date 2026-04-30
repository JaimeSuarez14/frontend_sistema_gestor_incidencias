import { Component, HostListener, signal } from '@angular/core';
import { SidebarDashboardComponent } from '../sidebar/sidebar-dashboard.component';
import { HeaderDashboardComponent } from '../header/header-dashboard.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [SidebarDashboardComponent, HeaderDashboardComponent, RouterOutlet],
  template: `
    <div class="min-h-screen bg-gray-50">
      <app-sidebar [(collapsed)]="sidebarCollapsed" [(isOpen)]="isOpenSidebar" />
      <div
        [class]="
          (sidebarCollapsed() ? 'md:pl-16' : 'md:pl-64') +
          ' transition-all transform duration-300 ease-in-out'
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
  isOpenSidebar = signal(false);

  screenWidth = window.innerWidth;

  @HostListener('window:resize')
  onResize() {
    this.screenWidth = window.innerWidth;
    this.checkScreen();
  }

  checkScreen() {
    if (this.screenWidth < 768) {
      this.isOpenSidebar.set(false);
      this.sidebarCollapsed.set(false);
    }
  }

  toggleSidebar(): void {
    if( this.screenWidth >= 768 ){
      this.sidebarCollapsed.update((v) => !v);
    } else {
      this.isOpenSidebar.update(o => !o);
    }
  }
}
