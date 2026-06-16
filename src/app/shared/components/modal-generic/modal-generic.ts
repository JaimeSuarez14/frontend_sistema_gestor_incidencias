import { Component, input, model } from '@angular/core';

@Component({
  selector: 'app-modal-generic',
  imports: [],
  templateUrl: './modal-generic.html',
  styleUrl: './modal-generic.css',
})
export class ModalGeneric {
  isOpen = model<boolean>(false);
  toogleModal(){
    this.isOpen.set(false);
  }
}

