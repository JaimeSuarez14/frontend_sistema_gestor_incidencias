import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  imports: [FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  name = signal('');
  email = signal('');
  password = signal('');
  confirmPassword = signal('');
  error = signal('');
  success = signal(false);
  loading = signal(false);

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    this.error.set('');

    if (this.password() !== this.confirmPassword()) {
      this.error.set('Las contraseñas no coinciden');
      return;
    }

    if (this.password().length < 6) {
      this.error.set('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    this.loading.set(true);

    setTimeout(() => {
      const user = this.authService.register({
        name: this.name(),
        email: this.email(),
        password: this.password(),
        role: "EMPLEADO",
        estado: "ACTIVO",
        confirmPassword: this.confirmPassword(),
      });

      this.loading.set(false);

      if (user) {
        this.success.set(true);
        setTimeout(() => this.router.navigate(['/auth/login']), 2000);
      } else {
        this.error.set('El correo ya está registrado o los datos son inválidos');
      }
    }, 800);
  }

  goToLogin(): void {
    this.router.navigate(['/auth/login']);
  }
}
