export interface User {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "EMPLEADO" | "TECNICO_NIVEL_1" | "TECNICO_NIVEL_2" |  "TECNICO_NIVEL_3";
  estado : "ACTIVO" | "INACTIVO";
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: "ADMIN" | "EMPLEADO" | "TECNICO_NIVEL_1" | "TECNICO_NIVEL_2" |  "TECNICO_NIVEL_3";
  estado : "ACTIVO" | "INACTIVO";
}
