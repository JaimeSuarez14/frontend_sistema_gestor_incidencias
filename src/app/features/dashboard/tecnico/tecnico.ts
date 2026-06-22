import { Component } from '@angular/core';

@Component({
  selector: 'app-tecnico',
  imports: [],
  templateUrl: './tecnico.html',
  styleUrl: './tecnico.css',
})
export class Tecnico {
  getPriorityPercentage(priority: 'high' | 'medium' | 'low'): number {
    return 0;
  }
}
