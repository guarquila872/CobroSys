import { ClienteI, CorreoI } from "./response.interface";

// export class ClienteClass implements ClienteI
// {
//   id_cliente: number=0;
//   cli_identificacion!: string; 
//   cli_nombres!: string;
//   cli_tipo_identificacion!: number;
//   cli_genero!: string;
//   cli_estado_civil!: string;
//   cli_ocupacion!: string;
//   cli_fecha_nacimiento!: string;
//   cli_score!: string;
//   cli_fallecido!: string;
//   cli_fecha_fallecido!: string;
//   cli_observacion!: string;
//   cli_provincia!: string;
//   cli_canton!: string;
//   cli_parroquia!: string;
//   cli_fecha_act!: Date;
//   cli_fecha_desact!: Date;
//   cli_fecha_in!: Date;
//   cli_fecha_up!: Date;
//   cli_esactivo!: string;
//   cli_estado_contacta!: string;
//   cli_id_ultima_gestion!: string;
//   cli_baseactual!: string;
//   cli_origendatos!: string;
    
// }
export class CorreosClass  {
    id_correo!: number;
    cli_identificacion!: string;
    cor_descripcion!: string;
    cor_email!: string;
    cor_esactivo!: string;
    cor_tipo_correo!: string;
  }