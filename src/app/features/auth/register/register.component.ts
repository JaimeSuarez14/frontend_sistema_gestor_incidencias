import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@services/auth.service';
import { RegisterData } from 'src/app/core/models/usuario.model';
import {  firstValueFrom } from 'rxjs';
import { UserFormComponent } from '@shared/components/user-form-component/user-form-component';

@Component({
  selector: 'app-register',
  imports: [ UserFormComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  usuarioModel = signal<RegisterData>({
    area: 'ADMINISTRACION',
    nombre: '',
    correo: '',
    username: '',
    password: '',
    confirmPassword: '',
    rol: ''
  });

  success = signal(false);
  error = signal(false);
  authService = inject(AuthService);
  router = inject(Router);

  /*
  private cache = new Map<string, { data: boolean }>();
  validUsername = (usernameSignal: Signal<string | undefined>) => {
    return resource({
      params: () => usernameSignal(),
      loader: async ({ params: username }) => {
        if (!username) return undefined;
        // Check cache first
        const cached = this.cache.get(username);
        if (cached !== undefined) return cached;
        // Use injected service for validation
        const result = await firstValueFrom(this.authService.verificarUsername(username));
        // Cache result
        this.cache.set(username, { data: result.data });
        return result;
      },
    });
  };*/

  async handleRegister(userData: RegisterData) {
    try {
      const resul = await firstValueFrom(this.authService.registerNewUser(userData));
      if (resul.success) {
        this.success.set(true);
        this.error.set(false);
        setTimeout(() => {
          this.router.navigate(['/auth/login']);
        }, 5000);

        return;
      }
    } catch (error) {
      this.success.set(false);
      this.error.set(true);
      setTimeout(() => {
        this.error.set(false);
      }, 5000);
      return;
    }
  }

  goToLogin(): void {
    this.router.navigate(['/auth/login']);
  }

  roles = [
    {
        "id": 1,
        "name": "ROLE_ADMIN"
    },
    {
        "id": 2,
        "name": "ROLE_EMPLEADO"
    },
    {
        "id": 3,
        "name": "ROLE_TECNICO_NIVEL_1"
    },
    {
        "id": 4,
        "name": "ROLE_TECNICO_NIVEL_2"
    },
    {
        "id": 5,
        "name": "ROLE_TECNICO_NIVEL_3"
    }
]
}
