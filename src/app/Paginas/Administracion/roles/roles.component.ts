import { Component, Injectable, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { catchError, map } from 'rxjs';
import { Alertas } from 'src/app/Control/Alerts';
import { Fechas } from 'src/app/Control/Fechas';
import {
  ResultadoGestorI,
  ResultadoMenuI,
  ResultadoPermisosI,
} from 'src/app/Modelos/login.interface';
import {
  PermisoDetalleCI,
  PermisoDetalleMI,
  PermisosI,
  RolesI,
} from 'src/app/Modelos/response.interface';
import { ApiService } from 'src/app/service/api.service';
import { PermisosComponent } from '../permisos/permisos.component';

@Injectable({
  providedIn: 'root',
})
@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css'],
})
export class RolesComponent implements OnInit {
  constructor(
    private router: Router,
    private api: ApiService,
    private alerta: Alertas,
    public Fechas: Fechas,
    private cookeService: CookieService,
    private permisosCom: PermisosComponent
  ) {}
  ngOnInit(): void {
    this.ListarElementos(1);
  }

  permisos: ResultadoPermisosI = JSON.parse(localStorage.getItem('usuario')!);
  Usuario: ResultadoGestorI = this.permisos.gestor;
  Menu: ResultadoMenuI[] = this.permisos.menu;
  PaginaActual: ResultadoMenuI = this.Menu.find((elemento) => {
    return elemento.men_url === 'roles';
  }) as ResultadoMenuI;
  ConstanteFraccion: number = Number(this.Usuario.usr_fraccion_datos);
  RangoDatos: number = Number(this.Usuario.usr_rango_datos);
  LecturaEscritura: number = Number(this.PaginaActual.men_lectura);
  PaginaNombre: string = this.PaginaActual.men_descripcion;
  loading: boolean = false;
  // visible: boolean = false;

  // ****************************************** CONTROLES DE BUSQUEDA *****************************************************************
  ParametrosDeBusqueda: Array<string> = [
    '',
    'Descripción',
    'Descripción Incompleta',
    'Estado',
  ];
  ParametrosEstado: any[] = [
    { name: 'Activo', value: 1 },
    { name: 'Inactivo', value: 0 },
    // { name: 'Eliminados', value: 3 },
  ];

  itemBusqueda = new FormControl('', [Validators.required]);
  txtBusqueda = new FormControl('', [Validators.required]);

  GetBusquedaPor(item: string) {
    this.itemBusqueda.patchValue(item);
    this.txtBusqueda.patchValue('');
    const inputElement = document.getElementById(
      'txtValorBusqueda'
    ) as HTMLInputElement;

    if (item.length > 0 && inputElement != null) {
      inputElement.focus();
    }
  }
  ConvertirMayusculas() {
    this.txtBusqueda.patchValue(this.txtBusqueda.value!.toUpperCase());
  }
  // ****************************************** LISTAR ELEMENTOS *****************************************************************
  ListaRoles: RolesI[] = [];

  ListarElementos(num: number) {
    this.GetBusquedaPor('');
    if (num === 1) {
      this.ListaRoles = [];
      this.FraccionDatos = 0;
    }

    this.ListaRoles = [];
    this.loading = true;
    this.api
      .GetRolesFracionado(this.FraccionDatos, this.RangoDatos)
      .pipe(
        map((tracks) => {
          this.ListaRoles = tracks['data'];
          this.DatosTemporalesBusqueda = tracks['data'];
          if (this.ListaRoles.length === 0) {
            this.loading = false;
            this.alerta.NoExistenDatos();
          } else {
            this.loading = false;
            this.ContadorDatosGeneral = this.ListaRoles.length;
            this.FraccionarValores(0, this.ListaRoles, this.ConstanteFraccion);
          }
        }),
        catchError((error) => {
          this.loading = false;
          this.alerta.ErrorAlRecuperarElementos();
          throw new Error(error);
        })
      )
      .subscribe();
  }
  FiltrarElemento() {
    const valor: any = this.txtBusqueda.value?.toString();
    let tipo: number;
    if (this.itemBusqueda.value === 'Estado') {
      tipo = 0;
      this.GetFiltrarElemento(valor, tipo);
    }
    if (this.itemBusqueda.value === 'Descripción') {
      tipo = 1;
      this.GetFiltrarElemento(valor, tipo);
    }
    if (this.itemBusqueda.value === 'Descripción Incompleta') {
      tipo = 3;
      this.GetFiltrarElemento(valor, tipo);
    }
  }

  GetFiltrarElemento(valor: string, tipo: number) {
    this.ListaRoles = [];
    this.loading = true;

    this.api
      .GetRolesFracionadoFiltro(valor, tipo)
      .pipe(
        map((tracks) => {
          this.ListaRoles = tracks['data'];
          this.DatosTemporalesBusqueda = tracks['data'];
          if (this.ListaRoles.length === 0) {
            this.loading = false;
            this.alerta.NoExistenDatos();
          } else {
            this.loading = false;
            this.ContadorDatosGeneral = this.ListaRoles.length;
            this.FraccionarValores(0, this.ListaRoles, this.ConstanteFraccion);
          }
        }),
        catchError((error) => {
          this.loading = false;
          this.alerta.ErrorAlRecuperarElementos();
          throw new Error(error);
        })
      )
      .subscribe();
  }
  /************************************** AGREGAR ELEMENTO  ******************************************************** */
  TituloFormulario = '';

  RolesForms = new FormGroup({
    id_rol: new FormControl(0, Validators.required),
    id_permiso: new FormControl('', Validators.required),
    rol_descripcion: new FormControl('', Validators.required),
    rol_observacion: new FormControl(''),
    rol_fecha_act: new FormControl(this.Fechas.fecha()),
    rol_fecha_desact: new FormControl(this.Fechas.fecha()),
    rol_fecha_in: new FormControl(this.Fechas.fecha()),
    rol_fecha_up: new FormControl(this.Fechas.fecha()),
    rol_esactivo: new FormControl(true),
  });
  ResetRolesForms() {
    this.RolesForms.reset({
      id_rol: 0,
      id_permiso: '',
      rol_descripcion: '',
      rol_observacion: '',
      rol_fecha_act: this.Fechas.fecha(),
      rol_fecha_desact: this.Fechas.fecha(),
      rol_fecha_in: this.Fechas.fecha(),
      rol_fecha_up: this.Fechas.fecha(),
      rol_esactivo: true,
    });
  }
  ActDesControles(num: number) {
    if (num === 0) {
      //inactivos
      this.RolesForms.get('id_rol')?.disable();
      this.RolesForms.get('id_permiso')?.disable();
      this.RolesForms.get('rol_descripcion')?.disable();
      this.RolesForms.get('rol_observacion')?.disable();
      this.RolesForms.get('rol_fecha_act')?.disable();
      this.RolesForms.get('rol_fecha_desact')?.disable();
      this.RolesForms.get('rol_fecha_in')?.disable();
      this.RolesForms.get('rol_fecha_up')?.disable();
      this.RolesForms.get('rol_esactivo')?.disable();
    }
    if (num === 1) {
      //activos
      this.RolesForms.get('id_rol')?.enable();
      this.RolesForms.get('id_permiso')?.enable();
      this.RolesForms.get('rol_descripcion')?.enable();
      this.RolesForms.get('rol_observacion')?.enable();
      this.RolesForms.get('rol_fecha_act')?.enable();
      this.RolesForms.get('rol_fecha_desact')?.enable();
      this.RolesForms.get('rol_fecha_in')?.enable();
      this.RolesForms.get('rol_fecha_up')?.enable();
      this.RolesForms.get('rol_esactivo')?.enable();
    }
    if (num === 2) {
      //edicion
      this.RolesForms.get('id_permiso')?.enable();
      this.RolesForms.get('rol_descripcion')?.enable();
      this.RolesForms.get('rol_observacion')?.enable();
      this.RolesForms.get('rol_esactivo')?.enable();
    }
  }

  AgregarEditarElemento(num: number) {
    if (num === 1) {
      this.ActDesControles(0);
      this.TituloFormulario = 'Agregar';
      this.ActDesControles(2);
    }
    if (num === 2) {
      this.ActDesControles(0);
      this.TituloFormulario = 'Editar';
      this.ActDesControles(2);
    }
    if (num === 3) {
      this.TituloFormulario = 'Visualizar';
      this.ActDesControles(0);
    }
  }

  CerrarAgregarEditarElemento() {
    this.EncerarComponentes();
  }

  GuardarObjeto(datos: any) {
    datos.id_permiso = Number(datos.id_permiso);
    datos.rol_esactivo = datos.rol_esactivo.toString() === 'true' ? '1' : '0';
    if (this.TituloFormulario === 'Editar') {
      this.api
        .PutRoles(datos)
        .pipe(
          map((tracks) => {
            const exito = tracks['exito'];
            if (exito == 1) {
              this.ListarElementos(1);
              this.CerrarAgregarEditarElemento();
              this.EncerarComponentes();
              // this.TextoFiltro.patchValue('');
              this.alerta.RegistroActualizado();
            } else {
              this.alerta.ErrorEnLaPeticion(tracks['mensaje']);
              this.ActDesControles(0);
              this.ActDesControles(2);
            }
          }),
          catchError((error) => {
            this.alerta.ErrorEnLaOperacion();
            this.ActDesControles(0);
            this.ActDesControles(2);
            throw new Error(error);
          })
        )
        .subscribe();
    } else {
      this.api
        .PostRoles(datos)
        .pipe(
          map((tracks) => {
            const exito = tracks['exito'];
            if (exito == 1) {
              this.ListarElementos(1);
              this.CerrarAgregarEditarElemento();
              this.EncerarComponentes();
              // this.TextoFiltro.patchValue('');
              this.alerta.RegistroAgregado();
            } else {
              this.alerta.ErrorEnLaPeticion(tracks['mensaje']);
              this.ActDesControles(0);
              this.ActDesControles(2);
            }
          }),
          catchError((error) => {
            this.alerta.ErrorEnLaOperacion();
            this.ActDesControles(0);
            this.ActDesControles(2);
            throw new Error(error);
          })
        )
        .subscribe();
    }
  }

  /************************************** EDITAR ELEMENTO  ******************************************************** */
  ActualizaEstado(elemento: RolesI) {
    elemento.rol_esactivo = (elemento.rol_esactivo == '1' ? 0 : 1).toString();
    this.api.PutRoles(elemento).subscribe((x) => this.ListarElementos(1));
  }
  EliminarElemento(elemento: RolesI) {
    this.alerta.EliminarRegistro().then((confirmado) => {
      if (confirmado) {
        elemento.rol_esactivo = '3';
        this.api.PutRoles(elemento).subscribe((x) => {
          this.ListarElementos(1);
          this.alerta.RegistroEliminado();
        });
      }
    });
  }
  CargarElemento(datos: any, num: number) {
    this.RolesForms.patchValue({
      id_rol: datos.id_rol,
      id_permiso: datos.id_permiso,
      rol_descripcion: datos.rol_descripcion,
      rol_observacion: datos.rol_observacion,
      rol_fecha_act: this.Fechas.fechaFormato(datos.rol_fecha_act),
      rol_fecha_desact: this.Fechas.fechaFormato(datos.rol_fecha_desact),
      rol_fecha_in: this.Fechas.fechaFormato(datos.rol_fecha_in),
      rol_fecha_up: this.Fechas.fechaFormato(datos.rol_fecha_up),
      rol_esactivo: datos.rol_esactivo === '1' ? true : false,
    });
    if (num != 1) {
      this.ListarPermisos();
    }
    this.AgregarEditarElemento(num);
  }
  // ****************************************** OTROS ELEMENTOS *****************************************************************
  PermisosList: PermisosI[] = [];

  ListarPermisos() {
    this.api
      .GetPermisosFracionado(0, 0)
      .pipe(
        map((tracks) => {
          this.PermisosList = tracks['data'];
        })
      )
      .subscribe();
  }
  // ****************************************** OTROS ELEMENTOS   AGREGAR PERMISOS *****************************************************************

  ModoVista: boolean = false;
  VerPermiso(idpermiso: string) {    
    // this.ListadoMenus();
    // this.ListadoCartera();
    this.PermisosForms.get('perm_descripcion')?.disable();
    this.PermisosForms.get('perm_esactivo')?.disable();
    this.ModoVista = true;

    let Permiso: PermisosI = this.PermisosList.filter((elemento) => {
      return elemento.id_permiso == Number(idpermiso);
    })[0];
    this.PermisosForms.patchValue({
      perm_descripcion: Permiso.perm_descripcion,
      perm_esactivo: Permiso.perm_esactivo === '1' ? true : false,
    });
    let DetallesPerMenu: PermisoDetalleMI[] = [];
    for (let datosmenu of Permiso.detalles_menu) {
      let menu: any = {
        esActivo: datosmenu.perm_det_m_esactivo,
        isCheked: '0',
        idpermisomenu: datosmenu.id_perm_detalle_menu,
        menunombre: datosmenu.men_descripcion,
        menusecuencial: datosmenu.id_menu,
        tipoSeleccion: datosmenu.perm_det_m_lectura,
      };
      DetallesPerMenu.push(menu);
    }

    let DetallesPerCartera: PermisoDetalleMI[] = [];
    for (let datoscartera of Permiso.detalles_cartera) {
      let cartera: any = {
        Activo: datoscartera.perm_det_c_esactivo,
        Cheked: '0',
        idpermisocartera: datoscartera.id_perm_detalle_cartera,
        nombre: datoscartera.cart_descripcion,
        tipo: datoscartera.cart_tip_descripcion,
        idcartera: datoscartera.id_cartera,
        idtipocartera: datoscartera.id_perm_detalle_cartera,
      };
      DetallesPerCartera.push(cartera);
    }
    this.ListaMenus = DetallesPerMenu;
    this.ListaCarteras = DetallesPerCartera;
    this.ContadorDatosGeneralM = this.ListaMenus.length;
    this.ContadorDatosGeneralC = this.ListaCarteras.length;
    this.FraccionarValores(1, this.ListaMenus, 5);
    this.FraccionarValores(2, this.ListaCarteras, 5);
    (<HTMLElement>document.getElementById('ModalAgregarPermiso')).classList.add(
      'modal--show'
    );
  }
  AgregarPermiso() {
    this.RolesForms.patchValue({ id_permiso: '' });
    this.PermisosList = [];
    this.ListadoMenus();
    this.ListadoCartera();
    (<HTMLElement>document.getElementById('ModalAgregarPermiso')).classList.add(
      'modal--show'
    );
  }
  CerrarPermiso() {
    this.PermisosForms.get('perm_descripcion')?.enable();
    this.PermisosForms.get('perm_esactivo')?.enable();
    this.ModoVista = false;
    this.ListaMenus = [];
    this.ListaCarteras = [];
    this.VaciarFiltro(1);
    this.VaciarFiltro(2);
    this.EncerarVariablesPaginacion(1);
    this.EncerarVariablesPaginacion(2);
    this.ResetPermisosForms();
    this.DetallesPerMenu = [];
    this.DetallesPerCartera = [];
    (<HTMLElement>(
      document.getElementById('ModalAgregarPermiso')
    )).classList.remove('modal--show');
  }

  PermisosForms = new FormGroup({
    id_permiso: new FormControl(0, [Validators.required]),
    perm_descripcion: new FormControl('', Validators.required),
    perm_fecha_act: new FormControl(this.Fechas.fecha()),
    perm_fecha_desact: new FormControl(this.Fechas.fecha()),
    perm_fecha_in: new FormControl(this.Fechas.fecha()),
    perm_fecha_up: new FormControl(this.Fechas.fecha()),
    perm_esactivo: new FormControl(true),
  });

  ResetPermisosForms() {
    this.PermisosForms.reset({
      id_permiso: 0,
      perm_descripcion: '',
      perm_fecha_act: this.Fechas.fecha(),
      perm_fecha_desact: this.Fechas.fecha(),
      perm_fecha_in: this.Fechas.fecha(),
      perm_fecha_up: this.Fechas.fecha(),
      perm_esactivo: true,
    });
  }

  DetallesPerMenu: any[] = [];
  ListaMenus: any[] = [];
  SelecionarTodosMenu = new FormControl(false);

  ListadoMenus() {
    this.api
      .GetMenuFracionado(this.FraccionDatosM, this.RangoDatos)
      .pipe(
        map((tracks) => {
          let menu = tracks['data'];
          if (menu.length === 0) {
            this.loading = false;
            this.alerta.NoExistenDatos();
          } else {
            for (let datosmenu of tracks['data']) {
              let menu: any = {
                esActivo: '1',
                isCheked: '0',
                idpermisomenu: 0,
                menunombre: datosmenu.men_descripcion,
                menusecuencial: datosmenu.id_menu,
                tipoSeleccion: '1',
              };
              this.ListaMenus.push(menu);
              // this.DatosTemporalesBusquedaM.push(menu);
            }

            this.loading = false;
            this.ContadorDatosGeneralM = this.ListaMenus.length;

            this.FraccionarValores(1, this.ListaMenus, 5);
          }
        }),
        catchError((error) => {
          this.alerta.ErrorAlRecuperarElementos();
          throw new Error(error);
        })
      )

      .subscribe();
  }

  SeleccionarTodos() {
    const Checked = this.SelecionarTodosMenu.value;
    for (let datosmenuespejo of this.ListaMenus) {
      const posicion: number = this.ListaMenus.findIndex(
        (objeto) => objeto.menusecuencial === datosmenuespejo.menusecuencial
      );
      this.ListaMenus = this.ListaMenus.filter((elements) => {
        return !(elements.menusecuencial === datosmenuespejo.menusecuencial);
      });
      Checked === true
        ? (datosmenuespejo.isCheked = '1')
        : (datosmenuespejo.isCheked = '0');
      this.ListaMenus.splice(posicion, 0, datosmenuespejo);
    }
  }

  ActualizarMenu(datos: any, num: number) {
    const posicion: number = this.ListaMenus.findIndex(
      (objeto) => objeto.menusecuencial === datos.menusecuencial
    );
    this.ListaMenus = this.ListaMenus.filter((elements) => {
      return !(elements.menusecuencial === datos.menusecuencial);
    });

    if (num == 1) datos.isCheked = datos.isCheked === '0' ? '1' : '0';
    if (num == 2) datos.tipoSeleccion = datos.tipoSeleccion === '0' ? '1' : '0';
    if (num == 3) datos.esActivo = datos.esActivo === '0' ? '1' : '0';
    this.ListaMenus.splice(posicion, 0, datos);
  }
  DetallesPerCartera: any[] = [];
  ListaCarteras: any[] = [];
  SelecionarTodosCartera = new FormControl(false);

  ListadoCartera() {
    this.api
      .GetCarteraFracionado(this.FraccionDatosC, this.RangoDatos)
      .pipe(
        map((tracks) => {
          let cartera = tracks['data'];
          if (cartera.length === 0) {
            this.loading = false;
            this.alerta.NoExistenDatos();
          } else {
            for (let datoscartera of tracks['data']) {
              let cartera: any = {
                Activo: '1',
                Cheked: '0',
                idpermisocartera: 0,
                nombre: datoscartera.cart_descripcion,
                tipo: datoscartera.cart_tip_descripcion,
                idcartera: datoscartera.id_cartera,
                idtipocartera: datoscartera.id_tipo_cartera,
              };
              this.ListaCarteras.push(cartera);
            }

            this.loading = false;
            this.ContadorDatosGeneralC = this.ListaCarteras.length;

            if (this.DetallesPerCartera.length > 0) {
              for (let datoscartera of this.DetallesPerCartera) {
                const posicion: number = this.ListaCarteras.findIndex(
                  (objeto) => objeto.idcartera === datoscartera.idcartera
                );

                this.ListaCarteras = this.ListaCarteras.filter((elements) => {
                  return !(elements.idcartera === datoscartera.idcartera);
                });

                this.ListaCarteras.splice(posicion, 0, datoscartera);

                this.FraccionarValores(2, this.ListaCarteras, 5);
              }
            } else {
              this.FraccionarValores(2, this.ListaCarteras, 5);
            }
          }
        })
      )
      .subscribe();
  }

  SeleccionarTodosCartera() {
    const Checked = this.SelecionarTodosCartera.value;
    for (let datoscartera of this.ListaCarteras) {
      const posicion: number = this.ListaCarteras.findIndex(
        (objeto) => objeto.idcartera === datoscartera.idcartera
      );
      this.ListaCarteras = this.ListaCarteras.filter((elements) => {
        return !(elements.idcartera === datoscartera.idcartera);
      });
      Checked === true
        ? (datoscartera.Cheked = '1')
        : (datoscartera.Cheked = '0');
      this.ListaCarteras.splice(posicion, 0, datoscartera);
    }
  }

  ActualizarCartera(datos: any, num: number) {
    const posicion: number = this.ListaCarteras.findIndex(
      (objeto) => objeto.idcartera === datos.idcartera
    );
    this.ListaCarteras = this.ListaCarteras.filter((elements) => {
      return !(elements.idcartera === datos.idcartera);
    });

    if (num == 1) datos.Cheked = datos.Cheked === '0' ? '1' : '0';
    if (num == 3) datos.Activo = datos.Activo === '0' ? '1' : '0';
    this.ListaCarteras.splice(posicion, 0, datos);
  }

  GuardarObjetoPermisos(datos: any) {
    datos.perm_esactivo = datos.perm_esactivo.toString() === 'true' ? '1' : '0';
    for (let datosmenu of this.ListaMenus) {
      if (datosmenu.isCheked === '1') {
        let detalle = this.ListaMenus.filter(
          (item) => item.menusecuencial === datosmenu.menusecuencial
        );

        let menu: PermisoDetalleMI = {
          id_perm_detalle_menu: datosmenu.idpermisomenu,
          id_permiso: 0,
          id_menu: datosmenu.menusecuencial,
          men_descripcion: datosmenu.menunombre,
          perm_det_m_lectura: datosmenu.tipoSeleccion,
          perm_det_m_tipo: '0',
          perm_det_m_esactivo: datosmenu.esActivo,
        };
        this.DetallesPerMenu.push(menu);
      }
    }

    for (let datoscartera of this.ListaCarteras) {
      if (datoscartera.Cheked === '1') {
        let detalle = this.ListaCarteras.filter(
          (item) => item.idcartera === datoscartera.idcartera
        );

        let cartera: PermisoDetalleCI = {
          id_perm_detalle_cartera: datoscartera.idpermisocartera,
          id_permiso: 0,
          id_cartera: datoscartera.idcartera,
          cart_descripcion: datoscartera.nombre,
          cart_tip_descripcion: datoscartera.tipo,
          perm_det_c_esactivo: datoscartera.Activo,
        };
        this.DetallesPerCartera.push(cartera);
      }
    }

    datos.detalles_menu = this.DetallesPerMenu;
    datos.detalles_cartera = this.DetallesPerCartera;
    this.GuardarObjetoConDetalle(datos);
  }
  GuardarObjetoConDetalle(datos: PermisosI) {
    this.api
      .PostPermisos(datos)
      .pipe(
        map((tracks) => {
          const exito = tracks['exito'];
          if (exito == 1) {
            this.CerrarPermiso();
          } else {
            this.alerta.ErrorEnLaPeticion(tracks['mensaje']);
          }
        }),
        catchError((error) => {
          this.alerta.ErrorEnLaOperacion();
          throw new Error(error);
        })
      )
      .subscribe();
  }

  // ****************************************** ENCERAR COMPONENTES *****************************************************************
  EncerarComponentes() {
    // this.UsuarioVista = null;
    this.ResetRolesForms();
    /************ variables de Contenido ********** */
    this.loading = false;
    // this.visible = false;
    // this.FraccionDatos = 0;
    // this.DatosBienInmueble = [];
    this.itemBusqueda.patchValue('');
    this.txtBusqueda.patchValue('');
    // this.buscarPersona.patchValue('');

    this.TituloFormulario = '';
    this.PermisosList = [];
    
    this.ActDesControles(0);
  }
  // ****************************************** PAGINACION *****************************************************************
  DatosCargaMasiva!: any[];
  DatosTemporales: any[] = [];
  ContadorDatos: number = 0;
  RangoPaginacion: number = 0;
  InicioPaginacion: number = 0;
  FinalPaginacion: number = 0;
  FraccionDatos: number = 0;
  ContadorDatosGeneral: number = 0;

  DatosCargaMasivaM!: any[];
  DatosTemporalesM: any[] = [];
  ContadorDatosM: number = 0;
  RangoPaginacionM: number = 0;
  InicioPaginacionM: number = 0;
  FinalPaginacionM: number = 0;
  FraccionDatosM: number = 0;
  ContadorDatosGeneralM: number = 0;

  DatosCargaMasivaC!: any[];
  DatosTemporalesC: any[] = [];
  ContadorDatosC: number = 0;
  RangoPaginacionC: number = 0;
  InicioPaginacionC: number = 0;
  FinalPaginacionC: number = 0;
  FraccionDatosC: number = 0;
  ContadorDatosGeneralC: number = 0;

  FraccionarValores(tipo: number, datos?: any, rango?: number) {
    if (rango != null && datos != null) {
      if (tipo == 0) {
        this.EncerarVariablesPaginacion(0);
        this.ContadorDatos = datos.length;
        this.DatosTemporales = datos;
        this.RangoPaginacion = rango;
        this.FinalPaginacion = rango;
        this.DatosCargaMasiva = datos.slice(
          this.InicioPaginacion,
          this.FinalPaginacion
        );
      }
      if (tipo == 1) {
        this.EncerarVariablesPaginacion(1);
        this.ContadorDatosM = datos.length;
        this.DatosTemporalesM = datos;
        this.RangoPaginacionM = rango;
        this.FinalPaginacionM = rango;
        this.DatosCargaMasivaM = datos.slice(
          this.InicioPaginacionM,
          this.FinalPaginacionM
        );
      }
      if (tipo == 2) {
        this.EncerarVariablesPaginacion(2);
        this.ContadorDatosC = datos.length;
        this.DatosTemporalesC = datos;
        this.RangoPaginacionC = rango;
        this.FinalPaginacionC = rango;
        this.DatosCargaMasivaC = datos.slice(
          this.InicioPaginacionC,
          this.FinalPaginacionC
        );
      }
    } else {
      if (tipo == 0) {
        this.DatosCargaMasiva = this.DatosTemporales.slice(
          this.InicioPaginacion,
          this.FinalPaginacion
        );
      }
      if (tipo == 1) {
        this.DatosCargaMasivaM = this.DatosTemporalesM.slice(
          this.InicioPaginacionM,
          this.FinalPaginacionM
        );
      }
      if (tipo == 2) {
        this.DatosCargaMasivaC = this.DatosTemporalesC.slice(
          this.InicioPaginacionC,
          this.FinalPaginacionC
        );
      }
    }
  }

  BtnNext(tipo: number, rango?: number) {
    if (tipo == 0) {
      if (rango != null) {
        this.FraccionDatos = this.FraccionDatos + this.RangoDatos;
        this.ListarElementos(2);
      }
      this.InicioPaginacion = this.InicioPaginacion + this.RangoPaginacion;
      this.FinalPaginacion = this.FinalPaginacion + this.RangoPaginacion;
      this.FraccionarValores(0);
    }
    if (tipo == 1) {
      if (rango != null) {
        this.FraccionDatosM = this.FraccionDatosM + this.RangoDatos;
        this.ListadoMenus();
      }
      this.InicioPaginacionM = this.InicioPaginacionM + this.RangoPaginacionM;
      this.FinalPaginacionM = this.FinalPaginacionM + this.RangoPaginacionM;
      this.FraccionarValores(1);
    }
    if (tipo == 2) {
      if (rango != null) {
        this.FraccionDatosC = this.FraccionDatosC + this.RangoDatos;
        this.ListadoCartera();
      }
      this.InicioPaginacionC = this.InicioPaginacionC + this.RangoPaginacionC;
      this.FinalPaginacionC = this.FinalPaginacionC + this.RangoPaginacionC;
      this.FraccionarValores(2);
    }
  }

  BtnPrevious(tipo: number, rango?: number) {
    if (tipo == 0) {
      if (rango != null) {
        this.FraccionDatos = this.FraccionDatos - this.RangoDatos;
        this.ListarElementos(2);
      }

      if (this.InicioPaginacion >= this.RangoPaginacion) {
        this.InicioPaginacion = this.InicioPaginacion - this.RangoPaginacion;
        this.FinalPaginacion = this.FinalPaginacion - this.RangoPaginacion;
        this.FraccionarValores(0);
      }
    }
    if (tipo == 1) {
      if (rango != null) {
        this.FraccionDatosM = this.FraccionDatosM - this.RangoDatos;
        this.ListadoMenus();
      }

      if (this.InicioPaginacionM >= this.RangoPaginacionM) {
        this.InicioPaginacionM = this.InicioPaginacionM - this.RangoPaginacionM;
        this.FinalPaginacionM = this.FinalPaginacionM - this.RangoPaginacionM;
        this.FraccionarValores(1);
      }
    }
    if (tipo == 2) {
      if (rango != null) {
        this.FraccionDatosC = this.FraccionDatosC - this.RangoDatos;
        this.ListadoCartera();
      }

      if (this.InicioPaginacionC >= this.RangoPaginacionC) {
        this.InicioPaginacionC = this.InicioPaginacionC - this.RangoPaginacionC;
        this.FinalPaginacionC = this.FinalPaginacionC - this.RangoPaginacionC;
        this.FraccionarValores(2);
      }
    }
  }

  EncerarVariablesPaginacion(tipo: number) {
    if (tipo == 0) {
      this.ContadorDatos = 0;
      this.RangoPaginacion = 0;
      this.InicioPaginacion = 0;
      this.FinalPaginacion = 0;
      this.DatosTemporales = [];
    }
    if (tipo == 1) {
      this.ContadorDatosM = 0;
      this.RangoPaginacionM = 0;
      this.InicioPaginacionM = 0;
      this.FinalPaginacionM = 0;
      this.DatosTemporalesM = [];
    }
    if (tipo == 2) {
      this.ContadorDatosC = 0;
      this.RangoPaginacionC = 0;
      this.InicioPaginacionC = 0;
      this.FinalPaginacionC = 0;
      this.DatosTemporalesC = [];
    }
  }
  /*********************  FILTRO MODO GENERAL *********************** */
  DatosTemporalesBusqueda: any[] = [];
  FirltroPor: string = '';

  FiltrarPor(filtro: string, etiqueta: number) {
    const TxtFiltro = document.getElementById(
      'TxtFiltro' + etiqueta
    ) as HTMLInputElement;
    const ThDescripcion = document.getElementById(
      'ThDescripcion' + etiqueta
    ) as HTMLInputElement;

    const lblFiltro = document.getElementById(
      'lblFiltro' + etiqueta
    ) as HTMLInputElement;
    lblFiltro.textContent = filtro;
    ThDescripcion.style.color = '';
    TxtFiltro.value = '';
    TxtFiltro.disabled = false;
    TxtFiltro.focus();
  }
  FiltrarLista(num: number, etiqueta: number) {
    const TxtFiltro = document.getElementById(
      'TxtFiltro' + etiqueta
    ) as HTMLInputElement;
    const lblFiltro = document.getElementById(
      'lblFiltro' + etiqueta
    ) as HTMLInputElement;
    const contador = TxtFiltro.value!.length;
    this.EncerarVariablesPaginacion(0);
    TxtFiltro.value = TxtFiltro.value!.toUpperCase();
    const ThDescripcion = document.getElementById(
      'ThDescripcion' + etiqueta
    ) as HTMLInputElement;
    if (lblFiltro.textContent === 'Descripcion') {
      let nombre = TxtFiltro.value!;
      if (num === 0) {
        const resultado = this.ListaRoles.filter((elemento) => {
          return elemento.rol_descripcion.includes(nombre.toUpperCase());
        });
        this.FraccionarValores(0, resultado, this.ConstanteFraccion);
      }
      if (num === 1) {
        const resultado = this.ListaMenus.filter((elemento) => {
          return elemento.menunombre.includes(nombre.toUpperCase());
        });
        this.FraccionarValores(1, resultado, 5);
      }
      if (num === 2) {
        const resultado = this.ListaCarteras.filter((elemento) => {
          return elemento.nombre.includes(nombre.toUpperCase());
        });

        this.FraccionarValores(2, resultado, 5);
      }

      if (contador != 0) {
        ThDescripcion.style.color = 'red';
      } else {
        ThDescripcion.style.color = '';
      }
    }
  }

  VaciarFiltro(etiqueta: number) {
    const TxtFiltro = document.getElementById(
      'TxtFiltro' + etiqueta
    ) as HTMLInputElement;
    const ThDescripcion = document.getElementById(
      'ThDescripcion' + etiqueta
    ) as HTMLInputElement;
    const lblFiltro = document.getElementById(
      'lblFiltro' + etiqueta
    ) as HTMLInputElement;
    lblFiltro.textContent = '';
    ThDescripcion.style.color = '';
    TxtFiltro.disabled = true;
    TxtFiltro.value = '';
    this.FirltroPor = '';
    if (etiqueta === 0) {
      this.FraccionarValores(
        0,
        this.DatosTemporalesBusqueda,
        this.ConstanteFraccion
      );
    }
    if (etiqueta === 1) {
      this.FraccionarValores(1, this.ListaMenus, 5);
    }
    if (etiqueta === 2) {
      this.FraccionarValores(2, this.ListaCarteras, 5);
    }
  }
}
