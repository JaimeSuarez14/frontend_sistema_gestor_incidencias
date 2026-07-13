export interface Usuario {
  id: bigint;
  nombre: string;
  username: string;
  correo: string;
  roles: Rol [];
  estado: 'ACTIVO' | 'INACTIVO';
  area: Area;
}

export type Area = 'RRHH'
    | 'ADMINISTRACION'
    | 'SISTEMAS'
    | 'MANTENIMIENTO'
    | 'CONTABILIDAD'
    | 'GERENCIA'
    | 'LOGISTICA';

export interface Page {
  number: number; //pagina
  size: number; //cuantos por pagina
  totalElements: number; //numero de items
  totalPages: number; //numero total de paginas
}

export interface PaginatedResponse<T> {
  content: T[],
  page: Page
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export type Role = "ROLE_ADMIN" | "ROLE_EMPLEADO" | "ROLE_TECNICO_NIVEL_1" | "ROLE_TECNICO_NIVEL_2" |  "ROLE_TECNICO_NIVEL_3" | "FACTOR_PASSWORD";

export interface RegisterData {
  nombre: string;
  username: string ;
  correo: string;
  password: string;
  confirmPassword: string;
  area : Area;
  rol: string
}

export interface CurrentUser {
  username: string;
  roles: Role[];
}

export interface Rol {
  id: bigint;
  name: Role;
}

export interface UserUpdate {
  nombre: string;
  username: string ;
  correo: string;
  estado: 'ACTIVO' | 'INACTIVO';
  area : Area;
}

export interface TecnicosDTO {
  id: bigint;
  nombre: string;
  cantidadIncidenciaPendiente: bigint;
}

