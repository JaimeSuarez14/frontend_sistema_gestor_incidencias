import { Component, inject, signal } from '@angular/core';
import { DashboardService } from '@services/dashboard.service';
import { IncedenteStatsUsuario, IncidentStatsDTO } from 'src/app/core/models/dashboard.model';
import { LoadingSpinner } from "@shared/components/loading-spinner/loading-spinner";
import { DatePipe } from "@angular/common"
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-usuario',
  imports: [LoadingSpinner, DatePipe, RouterLink],
  templateUrl: './usuario.html',
  styleUrl: './usuario.css',
})
export class Usuario {

  dashboardService =inject(DashboardService)
  incidentStatsDTO = signal<IncedenteStatsUsuario | null >(null);

  constructor(){
    this.getDashboard();

  }

  loading = signal(false);
  getDashboard() {
    this.loading.set(true);
    this.dashboardService.getIncientesStats().subscribe({
      next:(e) => {
        this.incidentStatsDTO.set(e);
        this.loading.set(true)
      },
      error:(error ) => {
        console.log(error?.error);

      }
    })
  }

}
