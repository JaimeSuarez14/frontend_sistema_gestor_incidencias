import { Component, model } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [ RouterLink, RouterLinkActive],
  templateUrl: './sidebar-dashboard.component.html'
})
export class SidebarDashboardComponent {
  collapsed = model(false);

  toggleCollapse(): void {
    this.collapsed.update(v => !v);
  }
}
