import { Component, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { SessionThema } from '../../../shared/utils/session-tema';
import { LoginCredentials } from 'src/app/core/models/usuario.model';
import { delay, timeout } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  error = signal('');
  loading = signal(false);
  sessionThema = inject(SessionThema);
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  loginForm = this.fb.group({
    usuario: ['', [Validators.required, Validators.minLength(4)]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }

    this.error.set('');
    this.loading.set(true);

    const credenciales: LoginCredentials = {
      username: this.loginForm.value.usuario!,
      password: this.loginForm.value.password!,
    };
    this.authService.login(credenciales).subscribe({
      next: (e) => {
        this.loading.set(false);
        this.router.navigate(['/dashboard']);
      },

      error: (e) => {
        this.loading.set(false);
        this.error.set(e.error.message);
      },
    });
  }

  goToRegister(): void {
    this.router.navigate(['/auth/register']);
  }
}
