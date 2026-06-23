import { AuthService } from '@services/auth.service';
import { Component, inject, model } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ajuste, logoSistema } from '@shared/utils/svgs';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar-dashboard.component.html',
})
export class SidebarDashboardComponent {
  collapsed = model(false);
  isOpen = model(false);
  authService = inject(AuthService);

  public toggleCollapse(): void {
    if (this.isOpen()) {
      this.setIsOpen();
      this.collapsed.set(false);
    } else {
      this.collapsed.update((v) => !v);
    }
  }

  public setIsOpen() {
    this.isOpen.update((o) => !o);
  }

  public logoSvg: SafeHtml;
  public ajuste:SafeHtml;

  constructor(private sanitizer: DomSanitizer) {
    const rawSvg = logoSistema;
    const ajusteSvg = ajuste;
    this.logoSvg = this.sanitizer.bypassSecurityTrustHtml(rawSvg);
    this.ajuste = this.sanitizer.bypassSecurityTrustHtml(ajusteSvg);
  }
}
