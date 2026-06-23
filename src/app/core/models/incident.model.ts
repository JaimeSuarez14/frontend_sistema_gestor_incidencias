import { Usuario } from "./usuario.model";

export interface Incidencia {
  id: number;
  titulo: string;
  descripcion: string;
  estado: Status;
  fechaCreacion: Date;
  usuario: Usuario;
  tecnico?: Usuario;
}

export type Status = "ABIERTO" | "PENDIENTE" | "CERRADO";
