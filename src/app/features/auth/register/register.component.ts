import { Component, inject, resource, Signal, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@services/auth.service';
import { RegisterData } from 'src/app/core/models/usuario.model';
import {
  form,
  FormField,
  required,
  email,
  minLength,
  validate,
  SchemaPath,
  FormRoot,
  debounce,
  validateHttp,
} from '@angular/forms/signals';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-register',
  imports: [FormField, FormRoot],
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
  });

  success = signal(false);
  loading = signal(false);
  authService = inject(AuthService);
  router = inject(Router);

  usuarioForm = form(
    this.usuarioModel,
    (schemaPath) => {
      required(schemaPath.correo, { message: 'Tu correo es requerido' });
      email(schemaPath.correo, { message: 'Correo inválido' });

      required(schemaPath.nombre, { message: 'Tu nombre es requerido' });
      minLength(schemaPath.nombre, 4, { message: 'Tu nombre debe tener al menos 4 caracteres' });
      this.notSpacesOnly(schemaPath.nombre, {
        message: 'Tu nombre no solo debe tener espacios vacios',
      });

      required(schemaPath.username, { message: 'Tu username es requerido' });
      minLength(schemaPath.username, 4, { message: 'Tu usuario debe tener al menos 4 caracteres' });
      this.notSpaces(schemaPath.username, { message: 'Tu usuario no puede contener espacios' });

      required(schemaPath.password, { message: 'Tu password es reqsuerido' });
      this.notSpaces(schemaPath.password, { message: 'Tu password no puede contener espacios' });
      minLength(schemaPath.password, 6, {
        message: 'Tu contraseña debe tener al menos 6 caracteres',
      });
      validate(schemaPath.confirmPassword, ({ value, valueOf }) => {
        const confirmPassword = value();
        const password = valueOf(schemaPath.password);
        if (confirmPassword !== password) {
          return {
            kind: 'passwordMismatch',
            message: 'Passwords do not match',
          };
        }
        return null;
      });
      debounce(schemaPath.username, 500);

      validateHttp(schemaPath.username, {
        request: ({ value }) => `http://localhost:8080/api/auth/${value()}`,

        onSuccess: (response: { exists: boolean }) =>
          response.exists
            ? {
                kind: 'usernameTaken',
                message: 'Usuario ya registrado',
              }
            : null,

        onError: () => ({
          kind: 'serverError',
          message: 'Error al validar',
        }),
      });
    },
    {
      submission: {
        action: async (field) => {
          const newUser: RegisterData = {
            area: field.area().value(),
            nombre: field.nombre().value(),
            correo: field.correo().value(),
            username: field.username!().value(),
            password: field.password().value(),
            confirmPassword: field.confirmPassword().value(),
          };
          const resul = await firstValueFrom(this.authService.registerNewUser(newUser));
          if (resul.success) {
            this.success.set(true);
          }

          return { kind: 'serverError', message: 'Failed to submit form' };
        },
      },
    },
  );

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
  };

  notSpaces(path: SchemaPath<string>, options: { message: string }) {
    validate(path, ({ value }) => {
      const username = value();
      if (username.includes(' ')) {
        return { kind: 'no-spaces', message: options.message };
      }
      return undefined; // no error
    });
  }

  notSpacesOnly(path: SchemaPath<string>, options: { message: string }) {
    validate(path, ({ value }) => {
      const username = value();
      if (username.trim() === '') {
        return { kind: 'no-spaces', message: options.message };
      }
      return undefined; // no error
    });
  }

  goToLogin(): void {
    this.router.navigate(['/auth/login']);
  }
}
