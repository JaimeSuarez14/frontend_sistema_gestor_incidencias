import { AuthService } from './../../core/services/auth.service';
import { Component, inject } from '@angular/core';
import { Admin } from "./admin/admin";
import { Usuario } from "./usuario/usuario";
import { Tecnico } from "./tecnico/tecnico";

@Component({
  selector: 'app-dashboard',
  imports: [Admin, Usuario, Tecnico],
  template: `

    @if(authService.isAdmin()){
      <app-admin />
    }@else if(authService.isEmpleado()){
      <app-usuario />
    }@else {
      <app-tecnico />
    }
  `,
})
export class DashboardComponent {
  authService = inject(AuthService);
}
