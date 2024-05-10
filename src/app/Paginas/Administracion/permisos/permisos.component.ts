import { Component, Injectable, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { listenToTriggers } from 'ngx-bootstrap/utils';
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
} from 'src/app/Modelos/response.interface';
import { ApiService } from 'src/app/service/api.service';

@Injectable({
  providedIn: 'root',
})

@Component({
  selector: 'app-permisos',
  templateUrl: './permisos.component.html',
  styleUrls: ['./permisos.component.css'],
})
export class PermisosComponent implements OnInit {
  constructor(
    private api: ApiService,
    private alerta: Alertas,
    public Fechas: Fechas,
    private cookeService: CookieService
  ) {}
  ngOnInit(): void {
    this.ListarElementos(1);
  }

  permisos: ResultadoPermisosI = JSON.parse(localStorage.getItem('usuario')!);
  Usuario: ResultadoGestorI = this.permisos.gestor;
  Menu: ResultadoMenuI[] = this.permisos.menu;
  PaginaActual: ResultadoMenuI = this.Menu.find((elemento) => {
    return elemento.men_url === 'permisos';
  }) as ResultadoMenuI;
  ConstanteFraccion: number = Number(this.Usuario.usr_fraccion_datos);
  RangoDatos: number = Number(this.Usuario.usr_rango_datos);
  LecturaEscritura: number = Number(this.PaginaActual.men_lectura);
  PaginaNombre: string = this.PaginaActual.men_descripcion;
  loading: boolean = false;

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
  ListaPermisos: PermisosI[] = [];

  ListarElementos(num: number) {
    this.GetBusquedaPor('');
    if (num === 1) {
      this.ListaPermisos = [];
      this.FraccionDatos = 0;
    }

    this.ListaPermisos = [];
    this.loading = true;
    this.api
      .GetPermisosFracionado(this.FraccionDatos, this.RangoDatos)
      .pipe(
        map((tracks) => {
          console.log(tracks);
          this.ListaPermisos = tracks['data'];
          this.DatosTemporalesBusqueda = tracks['data'];
          if (this.ListaPermisos.length === 0) {
            this.loading = false;
            this.alerta.NoExistenDatos();
          } else {
            this.loading = false;
            this.ContadorDatosGeneral = this.ListaPermisos.length;
            this.FraccionarValores(
              0,
              this.ListaPermisos,
              this.ConstanteFraccion
            );
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
    this.ListaPermisos = [];
    this.loading = true;

    this.api
      .GetPermisosFracionadoFiltro(valor, tipo)
      .pipe(
        map((tracks) => {
          this.ListaPermisos = tracks['data'];
          this.DatosTemporalesBusqueda = tracks['data'];
          if (this.ListaPermisos.length === 0) {
            this.loading = false;
            this.alerta.NoExistenDatos();
          } else {
            this.loading = false;
            this.ContadorDatosGeneral = this.ListaPermisos.length;
            this.FraccionarValores(
              0,
              this.ListaPermisos,
              this.ConstanteFraccion
            );
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
  ActDesControles(num: number) {
    if (num === 0) {
      //inactivos
      this.PermisosForms.get('id_permiso')?.disable();
      this.PermisosForms.get('perm_descripcion')?.disable();
      this.PermisosForms.get('perm_fecha_act')?.disable();
      this.PermisosForms.get('perm_fecha_desact')?.disable();
      this.PermisosForms.get('perm_fecha_in')?.disable();
      this.PermisosForms.get('perm_fecha_up')?.disable();
      this.PermisosForms.get('perm_esactivo')?.disable();
    }
    if (num === 1) {
      //activos
      this.PermisosForms.get('id_permiso')?.enable();
      this.PermisosForms.get('perm_descripcion')?.enable();
      this.PermisosForms.get('perm_fecha_act')?.enable();
      this.PermisosForms.get('perm_fecha_desact')?.enable();
      this.PermisosForms.get('perm_fecha_in')?.enable();
      this.PermisosForms.get('perm_fecha_up')?.enable();
      this.PermisosForms.get('perm_esactivo')?.enable();
    }
    if (num === 2) {
      //edicion
      this.PermisosForms.get('perm_descripcion')?.enable();
      this.PermisosForms.get('perm_esactivo')?.enable();
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
    datos.perm_esactivo = datos.perm_esactivo.toString() === 'true' ? '1' : '0';
    let PermisosDetMenu: PermisoDetalleMI[] = [];
    for (let datos of this.DetallesPerMenu) {
      let menu: PermisoDetalleMI = {
        id_perm_detalle_menu: datos.idpermisomenu,
        id_permiso: 0,
        id_menu: datos.menusecuencial,
        men_descripcion: datos.menunombre,
        perm_det_m_lectura: datos.tipoSeleccion,
        perm_det_m_tipo: '0',
        perm_det_m_esactivo: datos.esActivo,
      };

      PermisosDetMenu.push(menu);
    }

    let PermisosDetCartera: PermisoDetalleCI[] = [];

    for (let datos of this.DetallesPerCartera) {
      let cartera: PermisoDetalleCI = {
        id_perm_detalle_cartera: datos.idpermisocartera,
        id_permiso: 0,
        id_cartera: datos.idcartera,
        cart_descripcion: datos.nombre,
        cart_tip_descripcion: datos.tipo,
        perm_det_c_esactivo: datos.Activo,
      };

      PermisosDetCartera.push(cartera);
    }

    datos.detalles_menu = PermisosDetMenu;
    datos.detalles_cartera = PermisosDetCartera;
    this.GuardarObjetoConDetalle(datos);
  }
  GuardarObjetoConDetalle(datos: PermisosI) {
    if (this.TituloFormulario === 'Editar') {
      this.api
        .PutPermisos(datos)
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
        .PostPermisos(datos)
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
  ActualizaEstado(elemento: PermisosI) {
    elemento.perm_esactivo = (elemento.perm_esactivo == '1' ? 0 : 1).toString();
    this.api.PutPermisos(elemento).subscribe((x) => this.ListarElementos(1));
  }
  EliminarElemento(elemento: PermisosI) {
    this.alerta.EliminarRegistro().then((confirmado) => {
      if (confirmado) {
        elemento.perm_esactivo = '3';
        this.api.PutPermisos(elemento).subscribe((x) => {
          this.ListarElementos(1);
          this.alerta.RegistroEliminado();
        });
      }
    });
  }
  CargarElemento(datos: any, num: number) {
    this.PermisosForms.patchValue({
      id_permiso: datos.id_permiso,
      perm_descripcion: datos.perm_descripcion,
      perm_fecha_act: this.Fechas.fechaFormato(datos.perm_fecha_act),
      perm_fecha_desact: this.Fechas.fechaFormato(datos.perm_fecha_desact),
      perm_fecha_in: this.Fechas.fechaFormato(datos.perm_fecha_in),
      perm_fecha_up: this.Fechas.fechaFormato(datos.perm_fecha_up),
      perm_esactivo: datos.perm_esactivo === '1' ? true : false,
    });
    console.log(datos.detalles_menu);
    for (let datosmenu of datos.detalles_menu) {
      let menu: any = {
        esActivo: datosmenu.perm_det_m_esactivo,
        isCheked: '1',
        idpermisomenu: datosmenu.id_perm_detalle_menu,
        menunombre: datosmenu.men_descripcion,
        menusecuencial: datosmenu.id_menu,
        tipoSeleccion: datosmenu.perm_det_m_lectura,
      };
      this.DetallesPerMenu.push(menu);
    }
    for (let datoscartera of datos.detalles_cartera) {
      let cartera: any = {
        Activo: datoscartera.perm_det_c_esactivo,
        Cheked: '1',
        idpermisocartera: datoscartera.id_perm_detalle_cartera,
        nombre: datoscartera.cart_descripcion,
        tipo: datoscartera.cart_tip_descripcion,
        idcartera: datoscartera.id_cartera,
        idtipocartera: datoscartera.id_perm_detalle_cartera,
      };
      this.DetallesPerCartera.push(cartera);
    }
    this.ContadorDatosGeneralMD = this.DetallesPerMenu.length;
    this.ContadorDatosGeneralCD = this.DetallesPerCartera.length;
    this.FraccionarValores(2, this.DetallesPerMenu, 5);
    this.FraccionarValores(4, this.DetallesPerCartera, 5);
    this.AgregarEditarElemento(num);
  }

  // ****************************************** ENCERAR COMPONENTES *****************************************************************
  EncerarComponentes() {
    this.ResetPermisosForms();
    this.loading = false;
    // this.FraccionDatos = 0;
    // this.DatosBienInmueble = [];
    this.itemBusqueda.patchValue('');
    this.txtBusqueda.patchValue('');
    this.TituloFormulario = '';
    this.ActDesControles(0);
    this.DetallesPerCartera = [];
    this.DetallesPerMenu = [];
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

  DatosCargaMasivaMD!: any[];
  DatosTemporalesMD: any[] = [];
  ContadorDatosMD: number = 0;
  RangoPaginacionMD: number = 0;
  InicioPaginacionMD: number = 0;
  FinalPaginacionMD: number = 0;
  FraccionDatosMD: number = 0;
  ContadorDatosGeneralMD: number = 0;

  DatosCargaMasivaC!: any[];
  DatosTemporalesC: any[] = [];
  ContadorDatosC: number = 0;
  RangoPaginacionC: number = 0;
  InicioPaginacionC: number = 0;
  FinalPaginacionC: number = 0;
  FraccionDatosC: number = 0;
  ContadorDatosGeneralC: number = 0;

  DatosCargaMasivaCD!: any[];
  DatosTemporalesCD: any[] = [];
  ContadorDatosCD: number = 0;
  RangoPaginacionCD: number = 0;
  InicioPaginacionCD: number = 0;
  FinalPaginacionCD: number = 0;
  FraccionDatosCD: number = 0;
  ContadorDatosGeneralCD: number = 0;

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
        this.ContadorDatosMD = datos.length;
        this.DatosTemporalesMD = datos;
        this.RangoPaginacionMD = rango;
        this.FinalPaginacionMD = rango;
        this.DatosCargaMasivaMD = datos.slice(
          this.InicioPaginacionMD,
          this.FinalPaginacionMD
        );
      }
      if (tipo == 3) {
        this.EncerarVariablesPaginacion(3);
        this.ContadorDatosC = datos.length;
        this.DatosTemporalesC = datos;
        this.RangoPaginacionC = rango;
        this.FinalPaginacionC = rango;
        this.DatosCargaMasivaC = datos.slice(
          this.InicioPaginacionC,
          this.FinalPaginacionC
        );
      }
      if (tipo == 4) {
        this.EncerarVariablesPaginacion(4);
        this.ContadorDatosCD = datos.length;
        this.DatosTemporalesCD = datos;
        this.RangoPaginacionCD = rango;
        this.FinalPaginacionCD = rango;
        this.DatosCargaMasivaCD = datos.slice(
          this.InicioPaginacionCD,
          this.FinalPaginacionCD
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
        this.DatosCargaMasivaMD = this.DatosTemporalesMD.slice(
          this.InicioPaginacionMD,
          this.FinalPaginacionMD
        );
      }
      if (tipo == 3) {
        this.DatosCargaMasivaC = this.DatosTemporalesC.slice(
          this.InicioPaginacionC,
          this.FinalPaginacionC
        );
      }
      if (tipo == 4) {
        this.DatosCargaMasivaCD = this.DatosTemporalesCD.slice(
          this.InicioPaginacionCD,
          this.FinalPaginacionCD
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
        this.FraccionDatosMD = this.FraccionDatosMD + this.RangoDatos;
        this.ListadoMenus();
      }
      this.InicioPaginacionMD =
        this.InicioPaginacionMD + this.RangoPaginacionMD;
      this.FinalPaginacionMD = this.FinalPaginacionMD + this.RangoPaginacionMD;
      this.FraccionarValores(2);
    }
    if (tipo == 3) {
      if (rango != null) {
        this.FraccionDatosC = this.FraccionDatosC + this.RangoDatos;
        this.ListadoCartera();
      }
      this.InicioPaginacionC = this.InicioPaginacionC + this.RangoPaginacionC;
      this.FinalPaginacionC = this.FinalPaginacionC + this.RangoPaginacionC;
      this.FraccionarValores(3);
    }
    if (tipo == 4) {
      if (rango != null) {
        this.FraccionDatosCD = this.FraccionDatosCD + this.RangoDatos;
        this.ListadoCartera();
      }
      this.InicioPaginacionCD =
        this.InicioPaginacionCD + this.RangoPaginacionCD;
      this.FinalPaginacionCD = this.FinalPaginacionCD + this.RangoPaginacionCD;
      this.FraccionarValores(4);
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
        this.FraccionDatosMD = this.FraccionDatosMD - this.RangoDatos;
        this.ListadoMenus();
      }

      if (this.InicioPaginacionMD >= this.RangoPaginacionMD) {
        this.InicioPaginacionMD =
          this.InicioPaginacionMD - this.RangoPaginacionMD;
        this.FinalPaginacionMD =
          this.FinalPaginacionMD - this.RangoPaginacionMD;
        this.FraccionarValores(2);
      }
    }
    if (tipo == 3) {
      if (rango != null) {
        this.FraccionDatosC = this.FraccionDatosC - this.RangoDatos;
        this.ListadoCartera();
      }

      if (this.InicioPaginacionC >= this.RangoPaginacionC) {
        this.InicioPaginacionC = this.InicioPaginacionC - this.RangoPaginacionC;
        this.FinalPaginacionC = this.FinalPaginacionC - this.RangoPaginacionC;
        this.FraccionarValores(3);
      }
    }
    if (tipo == 4) {
      if (rango != null) {
        this.FraccionDatosCD = this.FraccionDatosCD - this.RangoDatos;
        this.ListadoCartera();
      }

      if (this.InicioPaginacionCD >= this.RangoPaginacionCD) {
        this.InicioPaginacionCD =
          this.InicioPaginacionCD - this.RangoPaginacionCD;
        this.FinalPaginacionCD =
          this.FinalPaginacionCD - this.RangoPaginacionCD;
        this.FraccionarValores(4);
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
      this.ContadorDatosMD = 0;
      this.RangoPaginacionMD = 0;
      this.InicioPaginacionMD = 0;
      this.FinalPaginacionMD = 0;
      this.DatosTemporalesMD = [];
    }
    if (tipo == 3) {
      this.ContadorDatosC = 0;
      this.RangoPaginacionC = 0;
      this.InicioPaginacionC = 0;
      this.FinalPaginacionC = 0;
      this.DatosTemporalesC = [];
    }
    if (tipo == 4) {
      this.ContadorDatosCD = 0;
      this.RangoPaginacionCD = 0;
      this.InicioPaginacionCD = 0;
      this.FinalPaginacionCD = 0;
      this.DatosTemporalesCD = [];
    }
  }
  /*********************  FILTRO MODO GENERAL *********************** */
  DatosTemporalesBusqueda: any[] = [];
  // DatosTemporalesBusquedaM: any[] = [];
  // DatosTemporalesBusquedaMD: any[] = [];
  FirltroPor: string = '';
  // TextoFiltro = new FormControl({ value: '', disabled: true }, [
  //   Validators.required,
  // ]);
  // TextoFiltroM = new FormControl({ value: '', disabled: true }, [
  //   Validators.required,
  // ]);

  FiltrarPor(filtro: string, etiqueta: number) {
    // this.FirltroPor = filtro;
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
    const contador = TxtFiltro.value!.trim().length!;
    this.EncerarVariablesPaginacion(0);
    TxtFiltro.value = TxtFiltro.value!.toUpperCase();
    const ThDescripcion = document.getElementById(
      'ThDescripcion' + etiqueta
    ) as HTMLInputElement;
    if (lblFiltro.textContent === 'Descripcion') {
      let nombre = TxtFiltro.value!;
      if (num === 0) {
        const resultado = this.ListaPermisos.filter((elemento) => {
          return elemento.perm_descripcion.includes(nombre.toUpperCase());
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
        const resultado = this.DetallesPerMenu.filter((elemento) => {
          return elemento.menunombre.includes(nombre.toUpperCase());
        });
        this.FraccionarValores(2, resultado, 5);
      }
      if (num === 3) {
        const resultado = this.ListaCarteras.filter((elemento) => {
          return elemento.nombre.includes(nombre.toUpperCase());
        });
        this.FraccionarValores(3, resultado, 5);
      }
      if (num === 4) {
        const resultado = this.DetallesPerCartera.filter((elemento) => {
          return elemento.nombre.includes(nombre.toUpperCase());
        });
        this.FraccionarValores(4, resultado, 5);
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
      this.FraccionarValores(2, this.DetallesPerMenu, 5);
    }
    if (etiqueta === 3) {
      this.FraccionarValores(3, this.ListaCarteras, 5);
    }
    if (etiqueta === 4) {
      this.FraccionarValores(4, this.DetallesPerCartera, 5);
    }
  }

  /*********************************************************************************************** */

  /***************************************** MODAL AGREGAR MENUS  ****************************************************** */
  ModalAgregarMenus() {
    this.ListadoMenus();

    (<HTMLElement>document.getElementById('ModalAgregarMenus')).classList.add(
      'modal--show'
    );

    // this.cargarDatos(datos, 2);
  }
  CerrarModalCargarMenus() {
    this.ListaMenus = [];
    this.DatosCargaMasivaM = [];
    const TxtFiltro = document.getElementById('TxtFiltro1') as HTMLInputElement;
    const ThDescripcion = document.getElementById(
      'ThDescripcion1'
    ) as HTMLInputElement;
    ThDescripcion.style.color = '';
    TxtFiltro.value = '';
    this.EncerarVariablesPaginacion(1);
    (<HTMLElement>(
      document.getElementById('ModalAgregarMenus')
    )).classList.remove('modal--show');
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

              if (this.DetallesPerMenu.length > 0) {
                for (let datosmenu of this.DetallesPerMenu) {
                  const posicion: number = this.ListaMenus.findIndex(
                    (objeto) =>
                      objeto.menusecuencial === datosmenu.menusecuencial
                  );

                  this.ListaMenus = this.ListaMenus.filter((elements) => {
                    return !(
                      elements.menusecuencial === datosmenu.menusecuencial
                    );
                  });

                  this.ListaMenus.splice(posicion, 0, datosmenu);

                  this.FraccionarValores(1, this.ListaMenus, 5);
                }
              } else {
                this.FraccionarValores(1, this.ListaMenus, 5);
              }
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

  AgregarMenusDetalle() {
    this.DetallesPerMenu = [];
    this.EncerarVariablesPaginacion(2);

    for (let datosmenu of this.ListaMenus) {
      if (datosmenu.isCheked === '1') {
        let detalle = this.ListaMenus.filter(
          (item) => item.menusecuencial === datosmenu.menusecuencial
        );

        let menu: any = {
          esActivo: datosmenu.esActivo,
          isCheked: datosmenu.isCheked,
          idpermisomenu: datosmenu.idpermisomenu,
          menunombre: datosmenu.menunombre,
          menusecuencial: datosmenu.menusecuencial,
          tipoSeleccion: datosmenu.tipoSeleccion,
        };
        this.DetallesPerMenu.push(menu);
      }
    }

    this.CerrarModalCargarMenus();    
    this.ContadorDatosGeneralMD = this.DetallesPerMenu.length;
    this.FraccionarValores(2, this.DetallesPerMenu, 5);
  }

  EliminarMenuList(dato: any) {
    this.EncerarVariablesPaginacion(2);
    this.DetallesPerMenu = this.DetallesPerMenu.filter((element) => {
      return !(dato.menusecuencial === element.menusecuencial);
    });
    this.ContadorDatosGeneralMD = this.DetallesPerMenu.length;
    this.FraccionarValores(2, this.DetallesPerMenu, 5);
  }

  /***************************************** MODAL AGREGAR CARTERA  ****************************************************** */
  ModalAgregarCartera() {
    this.ListadoCartera();
    (<HTMLElement>document.getElementById('ModalAgregarCartera')).classList.add(
      'modal--show'
    );
  }

  CerrarModalCargarCartera() {
    this.ListaCarteras = [];
    const TxtFiltro = document.getElementById('TxtFiltro3') as HTMLInputElement;
    const ThDescripcion = document.getElementById(
      'ThDescripcion3'
    ) as HTMLInputElement;
    ThDescripcion.style.color = '';
    TxtFiltro.value = '';
    this.EncerarVariablesPaginacion(1);
    (<HTMLElement>(
      document.getElementById('ModalAgregarCartera')
    )).classList.remove('modal--show');
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

                this.FraccionarValores(3, this.ListaCarteras, 5);
              }
            } else {
              this.FraccionarValores(3, this.ListaCarteras, 5);
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

  AgregarCarteraDetalle() {
    this.DetallesPerCartera = [];
    this.EncerarVariablesPaginacion(4);

    for (let datos of this.ListaCarteras) {
      if (datos.Cheked === '1') {
        let detalle = this.ListaCarteras.filter(
          (item) => item.idcartera === datos.idcartera
        );

        let cartera: any = {
          Activo: datos.Activo,
          Cheked: datos.Cheked,
          idpermisocartera: datos.idpermisocartera,
          nombre: datos.nombre,
          tipo: datos.tipo,
          idcartera: datos.idcartera,
          idtipocartera: datos.idtipocartera,
        };
        this.DetallesPerCartera.push(cartera);
      }
    }

    this.CerrarModalCargarCartera();
    this.ContadorDatosGeneralCD = this.DetallesPerCartera.length;
    this.FraccionarValores(4, this.DetallesPerCartera, 5);
  }

  EliminarCarteraList(dato: any) {
    this.EncerarVariablesPaginacion(4);
    this.DetallesPerCartera = this.DetallesPerCartera.filter((element) => {
      return !(dato.idcartera === element.idcartera);
    });
    this.ContadorDatosGeneralCD = this.DetallesPerCartera.length;
    this.FraccionarValores(4, this.DetallesPerCartera, 5);
  }
}
