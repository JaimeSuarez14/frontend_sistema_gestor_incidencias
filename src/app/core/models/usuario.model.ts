export interface Usuario {
  id: bigint;
  nombre: string;
  correo: string;
  rol: 'ADMIN' | 'EMPLEADO' | 'TECNICO_NIVEL_1' | 'TECNICO_NIVEL_2' | 'TECNICO_NIVEL_3';
  estado: 'ACTIVO' | 'INACTIVO';
  area:
    | 'RRHH'
    | 'ADMINISTRACION'
    | 'SISTEMAS'
    | 'MANTENIMIENTO'
    | 'CONTABILIDAD'
    | 'GERENCIA'
    | 'LOGISTICA';
}

export interface Page {
  number: number; //pagina
  size: number; //cuantos por pagina
  totalElements: number; //numero de items
  totalPages: number; //numero totla de paginas
}

export interface PaginatedResponse<T> {
  content: T[],
  page: Page
}
