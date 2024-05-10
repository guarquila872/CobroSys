import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './Login/login/login.component';
import { InicioComponent } from './Vistas/inicio/inicio.component';
import { ReportesComponent } from './Paginas/Reportes/reportes/reportes.component';
import { PerfilComponent } from './Paginas/Perfil/perfil/perfil.component';
import { MenusComponent } from './Paginas/Administracion/menus/menus.component';
import { AdministracionComponent } from './Paginas/Administracion/administracion/administracion.component';
import { UsuariosComponent } from './Paginas/Administracion/usuarios/usuarios.component';
import { CarteraComponent } from './Paginas/Administracion/cartera/cartera.component';
import { TipoCarteraComponent } from './Paginas/Administracion/tipo-cartera/tipo-cartera.component';
import { TokenGuard } from './Control/token.guard';
import { RolesComponent } from './Paginas/Administracion/roles/roles.component';
import { PermisosComponent } from './Paginas/Administracion/permisos/permisos.component';
import { GestoresComponent } from './Paginas/Administracion/gestores/gestores.component';
import { TipoCorreoComponent } from './Paginas/Administracion/tipo-correo/tipo-correo.component';
import { TipoDireccionComponent } from './Paginas/Administracion/tipo-direccion/tipo-direccion.component';
import { TipoDocAdicionalComponent } from './Paginas/Administracion/tipo-doc-adicional/tipo-doc-adicional.component';
import { TipoGestionComponent } from './Paginas/Administracion/tipo-gestion/tipo-gestion.component';
import { TipoTelefonoComponent } from './Paginas/Administracion/tipo-telefono/tipo-telefono.component';
import { TipoTrabajoComponent } from './Paginas/Administracion/tipo-trabajo/tipo-trabajo.component';
import { CliadminComponent } from './Paginas/Cliente/cliadmin/cliadmin.component';
import { ClienteComponent } from './Paginas/Cliente/cliente/cliente.component';
import { CorreoComponent } from './Paginas/Cliente/correo/correo.component';
import { DireccionComponent } from './Paginas/Cliente/direccion/direccion.component';
import { TelefonoComponent } from './Paginas/Cliente/telefono/telefono.component';
import { TrabajoComponent } from './Paginas/Cliente/trabajo/trabajo.component';
import { DetalleTelefonoComponent } from './Paginas/Administracion/detalle-telefono/detalle-telefono.component';
import { ConectividadComponent } from './Paginas/Administracion/conectividad/conectividad.component';
import { ContactabilidadComponent } from './Paginas/Administracion/contactabilidad/contactabilidad.component';
import { CuentaComponent } from './Paginas/Administracion/cuenta/cuenta.component';
import { GaranteComponent } from './Paginas/Cliente/garante/garante.component';
import { HistorialSesionesComponent } from './Paginas/Reportes/historial-sesiones/historial-sesiones.component';
import { HistorialDescansoComponent } from './Paginas/Reportes/historial-descanso/historial-descanso.component';
import { HisadminComponent } from './Paginas/Reportes/hisadmin/hisadmin.component';
import { AccionesComponent } from './Paginas/Reportes/acciones/acciones.component';
import { CargarComponent } from './Paginas/Independientes/cargar/cargar.component';
import { GestionarComponent } from './Paginas/Independientes/gestionar/gestionar.component';
import { GestionComponent } from './Paginas/Cliente/gestion/gestion.component';
import { PagosComponent } from './Paginas/Cliente/pagos/pagos.component';
import { CreditosComponent } from './Paginas/Cliente/creditos/creditos.component';
import { CostosOperacionalesComponent } from './Paginas/Administracion/costos-operacionales/costos-operacionales.component';
import { ActualizarComponent } from './Paginas/Administracion/actualizar/actualizar.component';


const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'inicio', component: InicioComponent },
  { path: 'reportes', component: ReportesComponent },
  { path: 'perfil', component: PerfilComponent },
  { path: 'menus', component: MenusComponent },
  { path: 'administracion', component: AdministracionComponent },
  { path: 'detallellamadas', component: DetalleTelefonoComponent },
  { path: 'usuarios', component: UsuariosComponent },
  { path: 'cartera', component: CarteraComponent },
  { path: 'tipocartera', component: TipoCarteraComponent },
  { path: 'roles', component: RolesComponent },
  { path: 'permisos', component: PermisosComponent },
  { path: 'gestores', component: GestoresComponent },
  { path: 'gestion', component: GestionComponent },
  { path: 'tipocorreo', component: TipoCorreoComponent },
  { path: 'tipodireccion', component: TipoDireccionComponent },
  { path: 'tipodocumento', component: TipoDocAdicionalComponent },
  { path: 'tipogestion', component: TipoGestionComponent },
  { path: 'tipotelefono', component: TipoTelefonoComponent },
  { path: 'tipotrabajo', component: TipoTrabajoComponent },
  { path: 'cliadmin', component: CliadminComponent },
  { path: 'cliadmin/:id', component: CliadminComponent },
  { path: 'cliente', component: ClienteComponent },
  { path: 'correo', component: CorreoComponent },
  { path: 'direccion', component: DireccionComponent },
  { path: 'telefono', component: TelefonoComponent },
  { path: 'trabajo', component: TrabajoComponent },
  { path: 'conectividad', component: ConectividadComponent },
  { path: 'contactabilidad', component: ContactabilidadComponent },
  { path: 'cuenta', component: CuentaComponent },
  { path: 'garante', component: GaranteComponent },
  { path: 'historialsesiones', component: HistorialSesionesComponent },
  { path: 'historialdescansos', component: HistorialDescansoComponent },
  { path: 'hisadmin', component: HisadminComponent },
  { path: 'acciones', component: AccionesComponent },
  { path: 'cargar', component: CargarComponent },
  { path: 'gestionar', component: GestionarComponent },
  { path: 'gestionar/:id', component: GestionarComponent },
  { path: 'gestionar/:cli/:car/:ges', component: GestionarComponent },
  { path: 'pagos', component: PagosComponent },
  { path: 'creditos', component: CreditosComponent },
  { path: 'costosoperacionales', component: CostosOperacionalesComponent },
  { path: 'actualizar', component: ActualizarComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
export const routingComponent = [
  LoginComponent,
  InicioComponent,
  ReportesComponent,
  PerfilComponent,
  MenusComponent,
  AdministracionComponent,
  DetalleTelefonoComponent,
  UsuariosComponent,
  CarteraComponent,
  TipoCarteraComponent,
  RolesComponent,
  PermisosComponent,
  GestoresComponent,
  GestionComponent,
  AccionesComponent,
  TipoCorreoComponent,
  TipoDireccionComponent,
  TipoDocAdicionalComponent,
  TipoGestionComponent,
  TipoTelefonoComponent,
  TipoTrabajoComponent,
  TrabajoComponent,
  ClienteComponent,
  CorreoComponent,
  DireccionComponent,
  TelefonoComponent,
  CliadminComponent,
  ConectividadComponent,
  ContactabilidadComponent,
  CuentaComponent,
  GaranteComponent,
  HistorialSesionesComponent,
  HistorialDescansoComponent,
  HisadminComponent,
  AccionesComponent,
  CargarComponent,
  GestionarComponent,
  PagosComponent,
  CreditosComponent,
  CostosOperacionalesComponent,
  ActualizarComponent,
];
