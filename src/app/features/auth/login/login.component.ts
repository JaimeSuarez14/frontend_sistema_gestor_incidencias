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
  usuario = signal('');
  password = signal('');
  error = signal('');
  loading = signal(false);
  sessionThema = inject(SessionThema);

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  async onSubmit(): Promise<void> {
    this.error.set('');
    this.loading.set(true);
    const success = await this.authService.login({
      username: this.usuario(),
      password: this.password(),
    });

    this.loading.set(false);

  }

  goToRegister(): void {
    this.router.navigate(['/auth/register']);
  }
}
