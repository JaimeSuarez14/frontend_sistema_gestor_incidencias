import { Component, effect, inject, input, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '@services/user.service';
import { Area } from 'src/app/core/models/usuario.model';

@Component({
  selector: 'app-update-user-form',
  imports: [ReactiveFormsModule],
  templateUrl: './update-user-form.html',
  styleUrl: './update-user-form.css',
})
export class UpdateUserForm {
  idUsuario = input<bigint>();
  dataResponse = output<any>();
  error = signal('');
  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  public areas: Area[] = [
    'RRHH',
    'ADMINISTRACION',
    'SISTEMAS',
    'MANTENIMIENTO',
    'CONTABILIDAD',
    'GERENCIA',
    'LOGISTICA',
  ];
  constructor() {
    effect(() => {
      const id = this.idUsuario();
      if (id) {
        this.userService.getUser(id).subscribe({
          next: (data) => {
            this.updateUserForm.patchValue({
              nombre: data.nombre,
              username: data.username,
              correo: data.correo,
              area: data.area,
              estado: data.estado,
            });
          },
          error: (err) => {
            this.error.set(err);
          },
        });
      }
    });
  }

  public updateUserForm = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(4)]],
    username: ['', [Validators.required, Validators.minLength(4)]],
    correo: ['', [Validators.required, Validators.email]],
    area: ['', [Validators.required, Validators.minLength(4)]],
    estado: ['', [Validators.required, Validators.minLength(4)]],
  });

  submitForm() {
    if (this.updateUserForm.valid) {
      const data = this.updateUserForm.value;
      this.dataResponse.emit(data);
    } else {
      this.updateUserForm.markAllAsTouched();
    }
  }
}
