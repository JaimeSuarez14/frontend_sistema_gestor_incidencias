import { Role } from 'src/app/core/models/usuario.model';

export const convertirRol = (rol: Role) => {
  let rolParse = '';
  switch (rol) {
    case 'ROLE_ADMIN':
      rolParse = 'Admin';
      break;
    case 'ROLE_TECNICO_NIVEL_1':
      rolParse = 'Tecnico 1';
      break;
    case 'ROLE_TECNICO_NIVEL_2':
      rolParse = 'Tecnico 2';
      break;
    case 'ROLE_TECNICO_NIVEL_3':
      rolParse = 'Tecnico 3';
      break;
    case 'ROLE_EMPLEADO':
      rolParse = 'Empleado';
      break;
    default:
      rolParse = 'Sin Rol';
      break;
  }
  return rolParse;
};
