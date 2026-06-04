import { Component, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { SessionThema } from '../../../shared/utils/session-tema';
import { LoginCredentials } from 'src/app/core/models/usuario.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  usuario = signal('');
  password = signal('');
  error = signal('');
  loading = signal(false);
  sessionThema = inject(SessionThema);

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  onSubmit() {
    this.error.set('');
    this.loading.set(true);

    const credenciales: LoginCredentials = {
      username: this.usuario(),
      password: this.password(),
    };
    this.authService.login(credenciales).subscribe({
      next: (e) => {
        this.router.navigate(['/dashboard']);
      },

      error: (e) => {
        this.error.set(e.error.message);
      },
    });

    this.loading.set(false);
  }

  goToRegister(): void {
    this.router.navigate(['/auth/register']);
  }
}
