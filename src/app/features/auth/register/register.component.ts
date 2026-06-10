import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '@services/auth.service';
import { RegisterData } from 'src/app/core/models/usuario.model';
import {form, FormField, required, email, min, minLength, validate} from '@angular/forms/signals';

@Component({
  selector: 'app-register',
  imports: [FormsModule , FormField],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {

  usuarioModel =signal<RegisterData>({
    area: "ADMINISTRACION",
    nombre: "",
    correo: "",
    username: "",
    password: "",
    confirmPassword: ""
  })

  error = signal('');
  success = signal(false);
  loading = signal(false);
  authService = inject (AuthService);
  router = inject(Router);

  usuarioForm = form(this.usuarioModel, (schemaPath) => {
    email(schemaPath.correo, {message: 'Correo inválido'});
    required(schemaPath.nombre);
    minLength(schemaPath.nombre, 4, {message: 'Tu nombre debe tener al menos 4 caracteres'});
    required(schemaPath.username);
    minLength(schemaPath.username, 4, {message: 'Tu usuario debe tener al menos 4 caracteres'});
    required(schemaPath.password);
    required(schemaPath.confirmPassword);
    validate(schemaPath.username, ({ value }) => {
    const username = value();
    if (username.includes(' ')) {
      return customError({ kind: 'no-spaces', message: 'Name cannot contain spaces' });
    }
    return undefined; // no error
  });
  });



  onSubmit(): void {
    this.error.set('');
    this.loading.set(true);

    if (this.validarPassword()) {
      this.error.set('Las contraseñas no coinciden');
      return;
    }

  }

  validarPassword(){
   return  this.usuarioForm.password().value === this.usuarioForm.confirmPassword().value && this.usuarioForm.password().value.length >= 6;
  }

  goToLogin(): void {
    this.router.navigate(['/auth/login']);
  }
}
