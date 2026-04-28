import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface UserSettings {
  nombre: string;
  correo: string;
  usuario: string;
  clave: string;
  rol: string;
  area: string;
}

@Component({
  selector: 'app-perfil-usuario',
  imports: [FormsModule],
  templateUrl: './perfil-usuario.html',
  styleUrl: './perfil-usuario.css',
})
export class PerfilUsuario {


  // ✏️ Modo edición
  editMode = signal(false);

  // 📊 Datos hardcodeados
  user = signal<UserSettings>({
    nombre: 'Juan Pérez',
    correo: 'juan@email.com',
    usuario: 'juanp',
    clave: '123456',
    rol: 'Admin',
    area: 'Sistemas'
  });

  // 🧠 Copia temporal para editar
  tempUser = signal<UserSettings>({...this.user()});

  toggleEdit() {
    this.tempUser.set({...this.user()});
    this.editMode.set(true);
  }

  save() {
    this.user.set({...this.tempUser()});
    this.editMode.set(false);
  }

  cancel() {
    this.editMode.set(false);
  }




}
