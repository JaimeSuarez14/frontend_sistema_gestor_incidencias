import { Component, effect, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SeguimientoDTO, SeguimientoResponseDto } from './../../../core/models/seguimiento.model';
import { SeguimientoService } from './../../../core/services/seguimiento.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '@services/auth.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-seguimiento-incidencia',
  imports: [ReactiveFormsModule, DatePipe],
  templateUrl: './seguimiento-incidencia.html',
  styleUrl: './seguimiento-incidencia.css',
})
export class SeguimientoIncidencia {
  seguimientoService = inject(SeguimientoService);
  misSeguimientos = signal<SeguimientoResponseDto[] | null>(null);
  private activatedRoute = inject(ActivatedRoute);
   incidenciaId = signal<number | undefined>(undefined);
  private router = inject(Router);
  authService = inject(AuthService);

  constructor() {
    this.activatedRoute.params.subscribe((params) => {
      const idStr = params['id'];
       if (idStr) {
        // convertir a numero y validar
        const idNum = Number(idStr);
        if (!isNaN(idNum) && idNum > 0) {
          this.incidenciaId.set(idNum);
        } else {
          console.warn('ID inválido (no es un número positivo):', idStr);
        }
      }
      this.formSeguimiento.patchValue({id: idStr})
    });

    effect(() => {
      const idStr = this.incidenciaId();
      if (idStr) {
        this.getMisSeguimientos();
      }
    });
  }

  getMisSeguimientos() {
    const id = this.incidenciaId()
    this.seguimientoService.obtenerMisSeguimientos(id!).subscribe({
      next: (e) => {
        console.log(e);
        const seguimientos = e.map(e => ({...e, fecha: new Date(e.fecha)}))
        this.misSeguimientos.set(seguimientos);
      },
      error: (err) => {
        console.error('Error al obtener seguimientos', err);
      }
    });
  }

  irIncidencias(){
    this.router.navigate(['incidencia'])
  }

  //enviar sseguimiento
  private fb = inject(FormBuilder);
  formSeguimiento = this.fb.group({
    id: ['', [Validators.required, Validators.min(1)]],
    comentario: ['', [Validators.required, Validators.minLength(4)]],
    estado: ['ACTIVO', [Validators.required, Validators.minLength(4)]],
  })

  enviarMensaje(m : string){
    this.formSeguimiento.patchValue({comentario:m});
  }
  enviarSeguimiento(){
    console.log(this.formSeguimiento.value);
    if(this.formSeguimiento.invalid){
      return
    }
    const request:SeguimientoDTO ={
      comentario: this.formSeguimiento.value.comentario!,
      estado: this.formSeguimiento.value.estado! as "ACTIVO",
      idIncidencia: this.formSeguimiento.value.id!,
    }
    this.seguimientoService.crearSeguimiento(request).subscribe({
      next:(e) => {
        console.log(e);
        this.getMisSeguimientos();
        this.formSeguimiento.reset({id:this.incidenciaId()?.toString(), estado:"ACTIVO" })
      }
    })

  }
}
