import { appConfig } from './../../../app.config';
import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '@services/auth.service';
import { RegisterData } from 'src/app/core/models/usuario.model';
import {
  form,
  FormField,
  required,
  email,
  min,
  minLength,
  validate,
  SchemaPath,
  FormRoot,
  validateTree,
  SchemaPathTree,
  PathKind,
} from '@angular/forms/signals';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-register',
  imports: [FormsModule, FormField, FormRoot],
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

      required(schemaPath.username, { message: 'Tu username es requerido' });
      minLength(schemaPath.username, 4, { message: 'Tu usuario debe tener al menos 4 caracteres' });
      this.notSpaces(schemaPath.username, { message: 'Tu usuario no puede contener espacios' });

      required(schemaPath.password, { message: 'Tu password es requerido' });
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
    },
    {
      submission: {
        action: async (field) => {
          const newUser: RegisterData = {
            area: field.area().value(),
            nombre: field.nombre().value(),
            correo: field.correo().value(),
            username: field.username().value(),
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

  notSpaces(path: SchemaPath<string>, options: { message: string }) {
    validate(path, ({ value }) => {
      const username = value();
      if (username.includes(' ')) {
        return { kind: 'no-spaces', message: options.message };
      }
      return undefined; // no error
    });
  }

  onSubmit(): void {
    this.loading.set(true);
  }

  goToLogin(): void {
    this.router.navigate(['/auth/login']);
  }
}
