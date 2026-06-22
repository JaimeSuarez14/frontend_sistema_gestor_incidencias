import { Component, effect, inject, input, model, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { noWhitespaceValidator } from '@shared/utils/validadores';

@Component({
  selector: 'app-incidencia-form',
  imports: [ReactiveFormsModule],
  templateUrl: './incidencia-form.html',
  styleUrl: './incidencia-form.css',
})
export class IncidenciaForm {
  title = input("");
  isChange = model(false); //PARA RESETEAR
  private fb = inject(FormBuilder);
  error = signal("");
  responseData = output<any>()
  incidenciaForm = this.fb.group({
    titulo:['', [Validators.required, Validators.minLength(4), noWhitespaceValidator]],
    descripcion: ['', [Validators.required, Validators.minLength(4), noWhitespaceValidator]]
  })

  constructor(){
    effect(()=> {
      if(!this.isChange()){
        this.incidenciaForm.reset();
      }
    })
  }


  submitForm(){
    if(this.incidenciaForm.invalid){
      this.incidenciaForm.markAllAsTouched();
      return;
    }
    this.responseData.emit(this.incidenciaForm.value);

  }
}
