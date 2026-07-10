import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { DashboardAdmin } from '../models/dashboard.model';
import { tap } from 'rxjs';
@Injectable({ providedIn: 'root' })
export class DashboardService {
  private http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl + '/api/dashboard';
  private readonly _data = signal<DashboardAdmin | null>(null);
  readonly data = this._data.asReadonly();

  public getDashboardAdmin() {
    return this.http.get<DashboardAdmin>(this.apiUrl + '/principal').pipe(
      tap((data) => {
        console.log(data);

        this._data.set(data);
      }),
    );
  }
}
