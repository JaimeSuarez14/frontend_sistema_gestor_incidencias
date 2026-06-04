export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  role: Roles[];
  estado : "ACTIVO" | "INACTIVO";
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export type Roles = "ROLE_ADMIN" | "ROLE_EMPLEADO" | "ROLE_TECNICO_NIVEL_1" | "ROLE_TECNICO_NIVEL_2" |  "ROLE_TECNICO_NIVEL_3" | "FACTOR_PASSWORD";

export interface RegisterData {
  name: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: Roles[];
  estado : "ACTIVO" | "INACTIVO";
}
