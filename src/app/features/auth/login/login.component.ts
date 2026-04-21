import { Component, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { SessionThema } from '../../../shared/utils/session-tema';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  email = signal('');
  password = signal('');
  error = signal('');
  loading = signal(false);
  sessionThema = inject(SessionThema);


  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  onSubmit(): void {
    this.error.set('');
    this.loading.set(true);

    setTimeout(() => {
      const success = this.authService.login({
        email: this.email(),
        password: this.password(),
      });

      this.loading.set(false);

      if (success) {
        this.router.navigate(['/dashboard']);
      } else {
        this.error.set('Credenciales inválidas. Intenta con juan.perez@empresa.com / admin123');
      }
    }, 800);
  }

  goToRegister(): void {
    this.router.navigate(['/auth/register']);
  }
}
