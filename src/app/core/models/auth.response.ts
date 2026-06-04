import { Role } from "./usuario.model";

export interface LoginResponse{
  token:string
}

export interface Decoded{
  sub: string;
  authorities: Role[];
}
