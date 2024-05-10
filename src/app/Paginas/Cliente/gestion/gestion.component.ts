import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { catchError, map } from 'rxjs';
import { Alertas } from 'src/app/Control/Alerts';
import { Fechas } from 'src/app/Control/Fechas';
import {
  ResultadoCarteraI,
  ResultadoGestorI,
  ResultadoMenuI,
  ResultadoPermisosI,
} from 'src/app/Modelos/login.interface';
import {
  ContactabilidadI,
  FiltroGestion,
  GestorI,
} from 'src/app/Modelos/response.interface';
import { ApiService } from 'src/app/service/api.service';

@Component({
  selector: 'app-gestion',
  templateUrl: './gestion.component.html',
  styleUrls: ['./gestion.component.css'],
})
export class GestionComponent implements OnInit {
  constructor(
    private api: ApiService,
    private alerta: Alertas,
    public fechas: Fechas,
    private cookeService: CookieService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // this.ListarElementos(1);
    this.CarterasGestor();
  }

  CarterasGestor() {
    for (let datos of this.Cartera) {
      let cartera: any = {
        cart_id: Number(datos.cart_id),
        cart_descripcion: datos.cart_descripcion,
        cart_tip_descripcion: datos.cart_tip_descripcion,
      };
      this.CarteraGestor.push(cartera);
      this.TodasCarteras.push(cartera.cart_id);
    }
  }

  permisos: ResultadoPermisosI = JSON.parse(localStorage.getItem('usuario')!);
  Usuario: ResultadoGestorI = this.permisos.gestor;
  Menu: ResultadoMenuI[] = this.permisos.menu;
  PaginaActual: ResultadoMenuI = this.Menu.find((elemento) => {
    return elemento.men_url === 'gestion';
  }) as ResultadoMenuI;
  ConstanteFraccion: number = Number(this.Usuario.usr_fraccion_datos);
  RangoDatos: number = Number(this.Usuario.usr_rango_datos);
  LecturaEscritura: number = Number(this.PaginaActual.men_lectura);
  PaginaNombre: string = this.PaginaActual.men_descripcion;
  loading: boolean = false;

  CarteraGestor: any[] = [];
  TodasCarteras: number[] = [];
  Cartera: ResultadoCarteraI[] = this.permisos.cartera;

  // ****************************************** CONTROLES DE BUSQUEDA *****************************************************************
  BuscarForms = new FormGroup({
    identificacion: new FormControl('', Validators.required),
    nombres_cliente: new FormControl('', Validators.required),
    cartera: new FormControl('0', Validators.required),
    gestor: new FormControl('0', Validators.required),
    contactabilidad: new FormControl('0', Validators.required),
    fecha_inicial: new FormControl(
      this.fechas.fechaActualCorta(),
      Validators.required
    ),
    fecha_final: new FormControl(
      this.fechas.fechaActualCorta(),
      Validators.required
    ),
    ultima_gestion: new FormControl(true, Validators.required),
  });

  ResetClienteForms() {
    this.BuscarForms.reset({
      identificacion: '',
      nombres_cliente: '',
      cartera: '0',
      gestor: '0',
      contactabilidad: '0',
      fecha_inicial: this.fechas.fechaActualCorta(),
      fecha_final: this.fechas.fechaActualCorta(),
      ultima_gestion: true,
    });
  }

  ListaContactabilidad: ContactabilidadI[] = [];

  ListarContactabilidad() {
    this.ListaContactabilidad = [];
    this.api
      .GetContactabilidadFracionado(0, 0)
      .pipe(
        map((tracks) => {
          this.ListaContactabilidad = tracks['data'];
        }),
        catchError((error) => {
          this.loading = false;
          this.alerta.ErrorAlRecuperarElementos();
          throw new Error(error);
        })
      )
      .subscribe();
  }

  ListaGestores: GestorI[] = [];

  ListarGestores() {
    console.log('aqui');
    this.ListaGestores = [];
    this.api
      .GetGestoresFracionadoFiltro('g', 20)
      .pipe(
        map((tracks) => {
          console.log(tracks['data']);
          this.ListaGestores = tracks['data'];
        }),
        catchError((error) => {
          this.loading = false;
          this.alerta.ErrorAlRecuperarElementos();
          throw new Error(error);
        })
      )
      .subscribe();
  }

  // ****************************************** LISTAR ELEMENTOS *****************************************************************
  ListaGestion: GestorI[] = [];
  FraccionDatos: number = 0;
  ContadorDatosGeneral: number = 0;

  ListarElementos(num: number) {
    // this.GetBusquedaPor('');
    if (num === 1) {
      this.ListaGestion = [];
      this.FraccionDatos = 0;
    }

    this.ListaGestion = [];
    this.loading = true;
    this.api
      .GetGestionFracionado(this.FraccionDatos, this.RangoDatos)
      .pipe(
        map((tracks) => {
          console.log(tracks['data']);
          this.ListaGestion = tracks['data'];
          this.DatosTemporalesBusqueda = tracks['data'];
          if (this.ListaGestion.length === 0) {
            this.loading = false;
            this.alerta.NoExistenDatos();
          } else {
            this.loading = false;
            this.ContadorDatosGeneral = this.ListaGestion.length;
            this.FraccionarValores(this.ListaGestion, this.ConstanteFraccion);
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

  // FiltrarElemento() {
  //   const valor: any = this.txtBusqueda.value?.toString();
  //   let tipo: number;
  //   if (this.itemBusqueda.value === 'Estado') {
  //     tipo = 0;
  //     this.GetFiltrarElemento(valor, tipo);
  //   }
  //   if (this.itemBusqueda.value === 'Descripción') {
  //     tipo = 1;
  //     this.GetFiltrarElemento(valor, tipo);
  //   }
  //   if (this.itemBusqueda.value === 'Descripción Incompleta') {
  //     tipo = 3;
  //     this.GetFiltrarElemento(valor, tipo);
  //   }
  // }

  GetFiltrarElemento(datos: any) {
    let filtro: FiltroGestion = {
      tipo: 1,
      identificacion: (datos.identificacion.trim() == ''
        ? '0'
        : datos.identificacion.trim())!,
      nombres_cliente: (datos.nombres_cliente.trim() == ''
        ? '0'
        : datos.nombres_cliente.trim())!,
      cartera:
        datos.cartera == '0' ? this.TodasCarteras : [Number(datos.cartera)],
      gestor: datos.gestor,
      contactabilidad: (datos.nombres_cliente == '0'
        ? 0
        : Number(datos.contactabilidad))!,
      fecha_inicial: datos.fecha_inicial,
      fecha_final: datos.fecha_final,
      ultima_gestion: datos.ultima_gestion == true ? '1' : '0',
    };

    datos.ultima_gestion = datos.ultima_gestion == true ? '1' : '0';
    this.ListaGestion = [];
    this.loading = true;
    console.log(datos);
    this.api
      .GetGestionFracionadoFiltro(filtro)
      .pipe(
        map((tracks) => {
          console.log(tracks['data']);
          this.ListaGestion = tracks['data'];
          this.DatosTemporalesBusqueda = tracks['data'];
          if (this.ListaGestion.length === 0) {
            this.loading = false;
            this.alerta.NoExistenDatos();
          } else {
            this.loading = false;
            this.ContadorDatosGeneral = this.ListaGestion.length;
            this.FraccionarValores(this.ListaGestion, this.ConstanteFraccion);
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

  AgregarGestion() {
    this.router.navigate(['/gestionar']);
  }
  Gestionar(datos: any) {
    this.router.navigate([
      '/gestionar',
      datos.Gestion.cli_identificacion,
      datos.Gestion.gest_id_cartera,
      datos.Gestion.id_gestion,
    ]);
  }

  // ****************************************** ENCERAR COMPONENTES *****************************************************************
  EncerarComponentes() {
    this.loading = false;
  }

  // ****************************************** PAGINACION *****************************************************************
  DatosCargaMasiva!: any[];
  DatosTemporales: any[] = [];
  ContadorDatos: number = 0;
  RangoPaginacion: number = 0;
  InicioPaginacion: number = 0;
  FinalPaginacion: number = 0;

  FraccionarValores(datos?: any, rango?: number) {
    if (rango != null && datos != null) {
      this.EncerarVariablesPaginacion();
      this.ContadorDatos = datos.length;
      this.DatosTemporales = datos;
      this.RangoPaginacion = rango;
      this.FinalPaginacion = rango;
      this.DatosCargaMasiva = datos.slice(
        this.InicioPaginacion,
        this.FinalPaginacion
      );
    } else {
      this.DatosCargaMasiva = this.DatosTemporales.slice(
        this.InicioPaginacion,
        this.FinalPaginacion
      );
    }
  }

  BtnNextUser(rango?: number) {
    if (rango != null) {
      this.FraccionDatos = this.FraccionDatos + this.RangoDatos;
      this.ListarElementos(2);
    }
    this.InicioPaginacion = this.InicioPaginacion + this.RangoPaginacion;
    this.FinalPaginacion = this.FinalPaginacion + this.RangoPaginacion;
    this.FraccionarValores();
  }

  BtnPreviousUser(rango?: number) {
    if (rango != null) {
      this.FraccionDatos = this.FraccionDatos - this.RangoDatos;
      this.ListarElementos(2);
    }

    if (this.InicioPaginacion >= this.RangoPaginacion) {
      this.InicioPaginacion = this.InicioPaginacion - this.RangoPaginacion;
      this.FinalPaginacion = this.FinalPaginacion - this.RangoPaginacion;
      this.FraccionarValores();
    }
  }

  EncerarVariablesPaginacion() {
    this.ContadorDatos = 0;
    this.RangoPaginacion = 0;
    this.InicioPaginacion = 0;
    this.FinalPaginacion = 0;
    this.DatosTemporales = [];
  }
  /*********************  FILTRO MODO GENERAL *********************** */
  DatosTemporalesBusqueda: any[] = [];
  FirltroPor: string = '';
  TextoFiltro = new FormControl({ value: '', disabled: true }, [
    Validators.required,
  ]);

  FiltrarPor(filtro: string) {
    this.FirltroPor = filtro;
    this.TextoFiltro.patchValue('');
    const inputElement = document.getElementById(
      'TxtFiltro'
    ) as HTMLInputElement;
    const ThDescripcion = document.getElementById(
      'ThDescripcion'
    ) as HTMLInputElement;
    const ThApellido = document.getElementById(
      'ThApellido'
    ) as HTMLInputElement;

    ThApellido.style.color = '';
    ThDescripcion.style.color = '';
    inputElement.disabled = false;
    inputElement.focus();
  }

  FiltrarLista(num: number) {
    const contador = this.TextoFiltro.value!.trim().length!;
    this.EncerarVariablesPaginacion();
    this.TextoFiltro.patchValue(this.TextoFiltro.value!.toUpperCase());
    const ThDescripcion = document.getElementById(
      'ThDescripcion'
    ) as HTMLInputElement;
    const ThApellido = document.getElementById(
      'ThApellido'
    ) as HTMLInputElement;
    if (this.FirltroPor === 'Nombre') {
      let nombre = this.TextoFiltro.value!;
      if (num === 0) {
        const resultado = this.ListaGestion.filter((elemento) => {
          return elemento.ges_nombres.includes(nombre.toUpperCase());
        });
        this.FraccionarValores(resultado, this.ConstanteFraccion);
      }

      if (contador != 0) {
        ThDescripcion.style.color = 'red';
      } else {
        ThDescripcion.style.color = '';
      }
    }
    if (this.FirltroPor === 'Apellido') {
      let nombre = this.TextoFiltro.value!;
      if (num === 0) {
        const resultado = this.ListaGestion.filter((elemento) => {
          return elemento.ges_apellidos.includes(nombre.toUpperCase());
        });
        this.FraccionarValores(resultado, this.ConstanteFraccion);
      }

      if (contador != 0) {
        ThApellido.style.color = 'red';
      } else {
        ThApellido.style.color = '';
      }
    }
  }

  VaciarFiltro() {
    const inputElement = document.getElementById(
      'TxtFiltro'
    ) as HTMLInputElement;
    const ThDescripcion = document.getElementById(
      'ThDescripcion'
    ) as HTMLInputElement;
    const ThApellido = document.getElementById(
      'ThApellido'
    ) as HTMLInputElement;
    ThDescripcion.style.color = '';
    ThApellido.style.color = '';
    inputElement.disabled = true;
    this.FirltroPor = '';
    this.TextoFiltro.patchValue('');
    this.FraccionarValores(
      this.DatosTemporalesBusqueda,
      this.ConstanteFraccion
    );
  }
}
