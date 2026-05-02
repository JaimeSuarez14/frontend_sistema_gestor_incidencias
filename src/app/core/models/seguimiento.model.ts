import { Incidencia } from "./incident.model";

export interface  Seguimiento {
  id: bigint,
  incidencia: Incidencia,
  comentario: string,
  fecha: string,
  estado: "ACTIVO" | "INACTIVO"
}
