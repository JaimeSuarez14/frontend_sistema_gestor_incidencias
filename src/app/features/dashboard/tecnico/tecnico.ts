import { Component } from '@angular/core';

@Component({
  selector: 'app-tecnico',
  imports: [],
  templateUrl: './tecnico.html',
  styleUrl: './tecnico.css',
})
export class Tecnico {
  getPriorityPercentage(priority: 'high' | 'medium' | 'low'): number {
    if(priority=="high"){
      return 70
    };
    if(priority=="medium"){
      return 40
    };

    if(priority=="low"){
      return 15
    };
    return 0;
  }
}
