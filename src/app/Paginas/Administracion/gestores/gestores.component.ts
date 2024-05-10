import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { catchError, map } from 'rxjs';
import { Alertas } from 'src/app/Control/Alerts';
import { Fechas } from 'src/app/Control/Fechas';
import { ResultadoGestorI, ResultadoMenuI, ResultadoPermisosI } from 'src/app/Modelos/login.interface';
import { GestorI } from 'src/app/Modelos/response.interface';
import { ApiService } from 'src/app/service/api.service';

@Component({
  selector: 'app-gestores',
  templateUrl: './gestores.component.html',
  styleUrls: ['./gestores.component.css']
})
export class GestoresComponent implements OnInit {
  constructor(private api: ApiService, private alerta: Alertas, public Fechas: Fechas,
    private cookeService: CookieService) {}

  ngOnInit(): void {
    this.ListarElementos(1);
  }

  permisos: ResultadoPermisosI = JSON.parse(localStorage.getItem('usuario')!);
  Usuario: ResultadoGestorI = this.permisos.gestor;  
  Menu: ResultadoMenuI[] = this.permisos.menu;  
  PaginaActual: ResultadoMenuI = this.Menu.find((elemento) => {
    return elemento.men_url === 'gestores';
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
      this.txtBusqueda.patchValue(
        this.txtBusqueda.value!.toUpperCase()
      );
  }
  // ****************************************** LISTAR ELEMENTOS *****************************************************************
  ListaGestores: GestorI[] = [];
  FraccionDatos: number = 0;
  ContadorDatosGeneral: number = 0;

  ListarElementos(num: number) {
    this.GetBusquedaPor('');
    if (num === 1) {
      this.ListaGestores = [];
      this.FraccionDatos = 0;
    }

    this.ListaGestores = [];
    this.loading = true;
    this.api
      .GetGestoresFracionado(this.FraccionDatos, this.RangoDatos)
      .pipe(
        map((tracks) => {
          console.log(tracks['data'])
          this.ListaGestores = tracks['data'];
          this.DatosTemporalesBusqueda = tracks['data'];
          if (this.ListaGestores.length === 0) {
            this.loading = false;
            this.alerta.NoExistenDatos();
          } else {
            this.loading = false;
            this.ContadorDatosGeneral = this.ListaGestores.length;
            this.FraccionarValores(
              this.ListaGestores,
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

  GetFiltrarElemento(valor: string, tipo: number){
    this.ListaGestores = [];
    this.loading = true;

    this.api
      .GetGestoresFracionadoFiltro(valor, tipo)
      .pipe(
        map((tracks) => {
          this.ListaGestores = tracks['data'];
          this.DatosTemporalesBusqueda = tracks['data'];
          if (this.ListaGestores.length === 0) {
            this.loading = false;
            this.alerta.NoExistenDatos();
          } else {
            this.loading = false;
            this.ContadorDatosGeneral = this.ListaGestores.length;
            this.FraccionarValores(
              this.ListaGestores,
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
  GestorForms = new FormGroup({
    id_gestor: new FormControl( 0, [Validators.required,]),
    ges_nombres: new FormControl('', Validators.required),
    ges_apellidos: new FormControl('', Validators.required),
    ges_esgestor: new FormControl(true),
    ges_observacion: new FormControl(''),
    ges_fecha_entrada: new FormControl(''),
    ges_fecha_salida: new FormControl(''),
    ges_fecha_act: new FormControl(this.Fechas.fecha()),
    ges_fecha_desact: new FormControl(this.Fechas.fecha()),
    ges_fecha_in: new FormControl(this.Fechas.fecha()),
    ges_fecha_up: new FormControl(this.Fechas.fecha()),
    ges_esactivo: new FormControl(true),
  });

  ResetGestorForms() {
    this.GestorForms.reset({
      id_gestor: 0,
      ges_nombres: '',
      ges_apellidos: '',
      ges_esgestor: true,
      ges_observacion: '',
      ges_fecha_entrada: '',
      ges_fecha_salida: '',
      ges_fecha_act: this.Fechas.fecha(),
      ges_fecha_desact: this.Fechas.fecha(),
      ges_fecha_in: this.Fechas.fecha(),
      ges_fecha_up: this.Fechas.fecha(),
      ges_esactivo: true,
    });
  }

  ActDesControles(num:number){
    if(num === 0){ //inactivos
      this.GestorForms.get('id_gestor')?.disable()
      this.GestorForms.get('ges_nombres')?.disable()
      this.GestorForms.get('ges_apellidos')?.disable()
      this.GestorForms.get('ges_esgestor')?.disable()
      this.GestorForms.get('ges_observacion')?.disable()
      this.GestorForms.get('ges_fecha_entrada')?.disable()
      this.GestorForms.get('ges_fecha_salida')?.disable()
      this.GestorForms.get('ges_fecha_act')?.disable()
      this.GestorForms.get('ges_fecha_desact')?.disable()
      this.GestorForms.get('ges_fecha_in')?.disable()
      this.GestorForms.get('ges_fecha_up')?.disable()
      this.GestorForms.get('ges_esactivo')?.disable()
    }
    if(num === 1){ //activos
      this.GestorForms.get('id_gestor')?.enable()
      this.GestorForms.get('ges_nombres')?.enable()
      this.GestorForms.get('ges_apellidos')?.enable()
      this.GestorForms.get('ges_esgestor')?.enable()
      this.GestorForms.get('ges_observacion')?.enable()
      this.GestorForms.get('ges_fecha_entrada')?.enable()
      this.GestorForms.get('ges_fecha_salida')?.enable()
      this.GestorForms.get('ges_fecha_act')?.enable()
      this.GestorForms.get('ges_fecha_desact')?.enable()
      this.GestorForms.get('ges_fecha_in')?.enable()
      this.GestorForms.get('ges_fecha_up')?.enable()
      this.GestorForms.get('ges_esactivo')?.enable()
      
    }
    if(num === 2){ //edicion')?.enable()
      this.GestorForms.get('ges_nombres')?.enable()
      this.GestorForms.get('ges_apellidos')?.enable()
      this.GestorForms.get('ges_esgestor')?.enable()
      this.GestorForms.get('ges_observacion')?.enable()
      this.GestorForms.get('ges_fecha_entrada')?.enable()
      this.GestorForms.get('ges_fecha_salida')?.enable()
      this.GestorForms.get('ges_esactivo')?.enable()
  
    }

    
  }

  
  AgregarEditarElemento(num: number) {
    
    if (num === 1) {
      this.ActDesControles(0);
      this.TituloFormulario = 'Agregar';
      this.ActDesControles(2)
    }
    if (num === 2) {
      this.ActDesControles(0);
      this.TituloFormulario = 'Editar';
      this.ActDesControles(2)
      
    }
    if (num === 3) {
      this.ActDesControles(0);
      this.TituloFormulario = 'Visualizar';
      this.ActDesControles(0)
    }
   
  }

  CerrarAgregarEditarElemento() {
      this.EncerarComponentes();
  }

  GuardarObjeto(datos:any) {
    const minDate = new Date('1969-12-31').toISOString().split('T')[0];
    datos.id_gestor = Number(datos.id_gestor)    
    datos.ges_fecha_entrada = datos.ges_fecha_entrada == '' ? minDate : datos.ges_fecha_entrada;
    datos.ges_fecha_salida = datos.ges_fecha_salida == '' ? minDate : datos.ges_fecha_salida;
    datos.ges_esactivo = datos.ges_esactivo.toString() === 'true' ? '1' : '0';
    datos.ges_esgestor = datos.ges_esgestor.toString() === 'true' ? '1' : '0';
    if (this.TituloFormulario === 'Editar') {
      this.api
        .PutGestores(datos)
        .pipe(
          map((tracks) => {
            const exito = tracks['exito'];
            if(exito == 1){
              this.ListarElementos(1);
              this.CerrarAgregarEditarElemento();
              this.EncerarComponentes();
              this.TextoFiltro.patchValue('');
              this.alerta.RegistroActualizado();
            }
            else{              
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
        .PostGestores(datos)
        .pipe(
          map((tracks) => {
            const exito = tracks['exito'];
            if(exito == 1){
              this.ListarElementos(1);
              this.CerrarAgregarEditarElemento();
              this.EncerarComponentes();
              this.TextoFiltro.patchValue('');
              this.alerta.RegistroAgregado();
            }
            else{
              
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
  ActualizaEstado(elemento: GestorI) {
    elemento.ges_esgestor = (
      elemento.ges_esgestor == '1' ? 0 : 1
    ).toString();
    elemento.ges_esactivo = (
      elemento.ges_esactivo == '1' ? 0 : 1
    ).toString();
    this.api.PutGestores(elemento).subscribe((x) => this.ListarElementos(1));
  }

  EliminarElemento(elemento: GestorI) {
    this.alerta.EliminarRegistro().then((confirmado) => {
      if (confirmado) {
        elemento.ges_esactivo = '3';
        this.api.PutGestores(elemento).subscribe((x) => {
          this.ListarElementos(1);
          this.alerta.RegistroEliminado();
        });
      }
    });
  }

  CargarElemento(datos: any, num: number) {
    this.GestorForms.patchValue({
      id_gestor: datos.id_gestor.toString(),
      ges_nombres: datos.ges_nombres,
      ges_apellidos: datos.ges_apellidos,
      ges_esgestor: datos.ges_esgestor  === '1' ? true : false,
      ges_observacion: datos.ges_observacion,
      ges_fecha_entrada: this.Fechas.fechaCortaFormato(datos.ges_fecha_entrada),
      ges_fecha_salida: this.Fechas.fechaCortaFormato(datos.ges_fecha_salida),
      ges_fecha_act: this.Fechas.fechaFormato(datos.ges_fecha_act),
      ges_fecha_desact: this.Fechas.fechaFormato(datos.ges_fecha_desact),
      ges_fecha_in: this.Fechas.fechaFormato(datos.ges_fecha_in),
      ges_fecha_up: this.Fechas.fechaFormato(datos.ges_fecha_up),
      ges_esactivo: datos.ges_esactivo === '1' ? true : false,
    });


    this.AgregarEditarElemento(num);
  }

  // ****************************************** ENCERAR COMPONENTES *****************************************************************
  EncerarComponentes() {
    // this.UsuarioVista = null;
    this.ResetGestorForms();
    /************ variables de Contenido ********** */
    this.loading = false;
    // this.visible = false;
    // this.FraccionDatos = 0;
    // this.DatosBienInmueble = [];
    this.itemBusqueda.patchValue('');
    this.txtBusqueda.patchValue('');
    // this.buscarPersona.patchValue('');

    this.TituloFormulario = '';
    this.ActDesControles(0);
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
        const resultado = this.ListaGestores.filter((elemento) => {
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
        const resultado = this.ListaGestores.filter((elemento) => {
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

