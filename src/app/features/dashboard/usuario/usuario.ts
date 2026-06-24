import { Component } from '@angular/core';

@Component({
  selector: 'app-usuario',
  imports: [],
  templateUrl: './usuario.html',
  styleUrl: './usuario.css',
})
export class Usuario {
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
