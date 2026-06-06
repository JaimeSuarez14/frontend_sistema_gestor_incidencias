import { Usuario } from "./usuario.model";

export interface Incidencia {
  id: number;
  titulo: string;
  descripcion: string;
  estado: Status;
  usuario: Usuario;
  tecnico: Usuario;
}

type Status = "ABIERTO" | "PENDIENTE" | "CERRADO";
