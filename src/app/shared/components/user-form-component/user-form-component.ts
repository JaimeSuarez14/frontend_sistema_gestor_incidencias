import { Component, inject, input, output, signal } from '@angular/core';
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
import { RegisterData } from 'src/app/core/models/usuario.model';
import { environment } from 'src/environments/environment.development';
import { StatusIcon } from '../status-icon/status-icon';

@Component({
  selector: 'app-user-form-component',
  imports: [FormField, FormRoot, StatusIcon],
  templateUrl: './user-form-component.html',
  styleUrl: './user-form-component.css',
})
export class UserFormComponent {
  isAdmin = input<boolean>(false);
  submitForm = output<any>();

  usuarioModel = signal<RegisterData>({
    area: 'ADMINISTRACION',
    nombre: '',
    correo: '',
    username: '',
    password: '',
    confirmPassword: '',
    rol: '',
  });

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

      required(schemaPath.password, { message: 'Tu password es requerido' });
      this.notSpaces(schemaPath.password, { message: 'Tu password no puede contener espacios' });
      minLength(schemaPath.password, 6, {
        message: 'Tu contraseña debe tener al menos 6 caracteres',
      });
      required(schemaPath.confirmPassword, { message: 'Tu confirmacion de password es requerido' });
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
        request: ({ value }) => `${environment.apiUrl}/api/auth/${value()}`,
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

      debounce(schemaPath.correo, 500);
      validateHttp(schemaPath.correo, {
        request: ({ value }) => `${environment.apiUrl}/api/auth/${value()}/validacion`,

        onSuccess: (response: { exists: boolean }) =>
          response.exists
            ? {
                kind: 'usernameTaken',
                message: 'Correo ya registrado',
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
            rol: field.rol().value(),
          };
          this.submitForm.emit(newUser);
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

  notSpacesOnly(path: SchemaPath<string>, options: { message: string }) {
    validate(path, ({ value }) => {
      const username = value();
      if (username.trim() === '') {
        return { kind: 'no-spaces', message: options.message };
      }
      return undefined; // no error
    });
  }

  roles = [
    {
      id: 1,
      name: 'ROLE_ADMIN',
    },
    {
      id: 2,
      name: 'ROLE_EMPLEADO',
    },
    {
      id: 3,
      name: 'ROLE_TECNICO_NIVEL_1',
    },
    {
      id: 4,
      name: 'ROLE_TECNICO_NIVEL_2',
    },
    {
      id: 5,
      name: 'ROLE_TECNICO_NIVEL_3',
    },
  ];
}
