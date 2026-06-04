import { Roles } from "./user.model";

export interface LoginResponse{
  token:string
}

export interface Decoded{
  sub: string;
  authorities: Roles[];
}
