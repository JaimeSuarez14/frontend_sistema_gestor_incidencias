import { Component, model } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [ RouterLink, RouterLinkActive],
  templateUrl: './sidebar-dashboard.component.html'
})
export class SidebarDashboardComponent {
  collapsed = model(false);
  isOpen =  model(false);

  public toggleCollapse(): void {
    if(this.isOpen()){
      this.setIsOpen();
      this.collapsed.set(false)
    }else {
      this.collapsed.update(v => !v);
    }
  }

  public setIsOpen(){
    this.isOpen.update(o => !o);
  }

}
