import { Component, inject, signal } from '@angular/core';
import { IncidenciaService } from '@services/incidencia.service';
import { UserService } from '@services/user.service';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DashboardService } from '@services/dashboard.service';
import { LoadingSpinner } from "@shared/components/loading-spinner/loading-spinner";


@Component({
  selector: 'app-admin',
  imports: [RouterLink, CommonModule, LoadingSpinner],
  templateUrl: './admin.html',
  styleUrl: './admin.css',
})
export class Admin {
  incidentService = inject(IncidenciaService);
  userService = inject(UserService);
  dashboardService = inject(DashboardService)

  constructor(){
    this.incidentService.getIncidencias().subscribe();
    this.getDataDashboard();
  }

  loading = signal(false);

  getDataDashboard(){
    this.loading.set(true);
    this.dashboardService.getDashboardAdmin().subscribe({
      next:(e) => {
         this.loading.set(false);
      } ,
      error:(err) => {
        console.log(err?.error);
      }
    })
  }



}
