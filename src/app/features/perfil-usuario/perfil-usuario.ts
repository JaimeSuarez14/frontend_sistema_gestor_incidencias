import { Component, inject, signal } from '@angular/core';

import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '@services/user.service';
import { Usuario } from 'src/app/core/models/usuario.model';
import { ModalGeneric } from "@shared/components/modal-generic/modal-generic";
import { AuthService } from '@services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-perfil-usuario',
  imports: [ReactiveFormsModule, ModalGeneric],
  templateUrl: './perfil-usuario.html',
})
export class PerfilUsuario {
  private fb = inject(FormBuilder);
  private usuarioService = inject(UserService);
  private authService = inject(AuthService);
  private router = inject(Router)
  user = signal<Usuario | null>(null);

  editMode = signal(false);

  form: FormGroup = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(4)]],
    username: ['', [Validators.required, Validators.minLength(4)]],
    correo: ['', [Validators.required, Validators.email]],
  });

  constructor() {
    this.cargarPerfil();
  }

  cargarPerfil() {
    this.usuarioService.getUsuarioPrincipal().subscribe({
      next: (usuario) => {
        this.user.set(usuario);
        this.form.patchValue({
          nombre: usuario.nombre,
          username: usuario.username,
          correo: usuario.correo,
        });
        this.form.disable();
      },
    });
  }

  editar() {
    this.editMode.set(true);
    this.form.enable();
  }

  cancelar() {
    const usuario = this.user();
    if (!usuario) return;
    this.form.patchValue({
      nombre: usuario.nombre,
      username: usuario.username,
      correo: usuario.correo,
    });
    this.form.disable();
    this.editMode.set(false);
  }

  async guardar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload = this.form.getRawValue();

    this.usuarioService.actualizarPerfil(payload).subscribe({
      next: (usuarioActualizado) => {
        this.user.set(usuarioActualizado);
        this.form.disable();
        this.editMode.set(false);
        this.openModal.set(true)
        setTimeout(() => {
          this.authService.logout();
          this.router.navigate(['/auth/login']);
        }, 5000);
      },
    });
  }
  //navegar en el tab
  tabs = signal([true, false, false])
  moveTab(i: number){ this.tabs.update(t => t.map((_, index) => i==index ? true: false)) }

  //abri modal
  openModal = signal(false);
}
