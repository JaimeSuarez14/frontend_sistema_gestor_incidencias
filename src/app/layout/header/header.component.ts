import { Component, output } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  template: `
    <header class="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm">
      <button 
        (click)="toggleSidebar.emit()"
        class="p-2 rounded-lg hover:bg-gray-100 transition-colors lg:hidden"
      >
        <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
        </svg>
      </button>
      
      <div class="flex items-center gap-4 ml-auto">
        <div class="flex items-center gap-3">
          <div class="text-right">
            <p class="text-sm font-medium text-gray-900">{{ authService.currentUser()?.name }}</p>
            <p class="text-xs text-gray-500 capitalize">{{ authService.currentUser()?.role }}</p>
          </div>
          <div class="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
            <img 
              src="https://i.pravatar.cc/150?img=3" 
              alt="Avatar"
              class="w-10 h-10 rounded-full object-cover"
            />
          </div>
        </div>
      </div>
    </header>
  `
})
export class HeaderComponent {
  toggleSidebar = output<void>();
  
  constructor(public authService: AuthService) {}
}