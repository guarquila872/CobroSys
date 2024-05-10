import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { CorreosClass } from 'src/app/Modelos/clases.interface';
import {
  ResultadoGestorI,
  ResultadoMenuI,
  ResultadoPermisosI,
} from 'src/app/Modelos/login.interface';
import {
  ClienteI,
  CorreoI,
  DireccionI,
  GaranteI,
  TelefonoI,
  TrabajoI,
} from 'src/app/Modelos/response.interface';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-cargar',
  templateUrl: './cargar.component.html',
  styleUrls: ['./cargar.component.css'],
})
export class CargarComponent implements OnInit {
  @ViewChild('archivoInput') archivoInput!: ElementRef;
  constructor(
    private router: Router,
    private cookeService: CookieService
  ) {}
  ngOnInit(): void {
    // this.SubMenus();
  }
  permisos: ResultadoPermisosI = JSON.parse(localStorage.getItem('usuario')!);
  Usuario: ResultadoGestorI = this.permisos.gestor;
  Menus: ResultadoMenuI[] = this.permisos.menu;
  PaginaActual: ResultadoMenuI = this.Menus.find((elemento) => {
    return elemento.men_url === 'cargar';
  }) as ResultadoMenuI;
  ConstanteFraccion: number = Number(this.Usuario.usr_fraccion_datos);
  RangoDatos: number = Number(this.Usuario.usr_rango_datos);
  LecturaEscritura: number = Number(this.PaginaActual.men_lectura);
  PaginaNombre: string = this.PaginaActual.men_descripcion;

  TituloPagina: string = '';
  cargando: boolean = false;
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  TipoArchivo: any[] = [
    { id: 1, name: 'IMAGEN', value: '1' },
    { id: 2, name: 'PDF', value: '2' },
    { id: 3, name: 'EXCEL', value: '3' },
    { id: 4, name: 'WORD', value: '4' },
    { id: 5, name: 'OTRO', value: '5' },
  ];
  itemFile = new FormControl('', [Validators.required]);
  CargarArchivos() {
    this.TituloPagina = 'Cargar Archivos';
  }
  cambiarTipoArchivo() {
    const SubirArchivo = document.getElementById(
      'SubirArchivo'
    ) as HTMLInputElement;

    if (this.itemFile.value == '1') {
      SubirArchivo.accept = 'image/*';
    } else if (this.itemFile.value == '2') {
      SubirArchivo.accept = '.pdf';
    } else if (this.itemFile.value == '3') {
      SubirArchivo.accept = '.csv';
    } else if (this.itemFile.value == '4') {
      SubirArchivo.accept = '.docx';
    } else {
      SubirArchivo.accept = '';
    }
  }

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  TipoElemento: any[] = [
    { id: 1, name: 'CLIENTES', value: '1' },
    { id: 2, name: 'CORREOS', value: '2' },
    { id: 3, name: 'DIRECCIONES', value: '3' },
    { id: 4, name: 'GARANTES', value: '4' },
    { id: 5, name: 'TELEFONOS', value: '5' },
    { id: 6, name: 'TRABAJOS', value: '6' },
  ];
  itemFiles = new FormControl('', [Validators.required]);
  CargarElementos() {
    this.TituloPagina = 'Cargar Elementos';
  }

  data: any[] = [];
  entidad!: any;

  // mostrar() {
  //   let valor: any = this.itemFiles.value?.toString();
  //   // if (valor === 'CLIENTES') {
  //   //   this.entidad = new ClienteClass();
  //   // }
  //   if (valor === 'CORREOS') {
  //     this.entidad: = new CorreosClass();
  //   }
  // }
  //   //  if(valor==="DIRECCIONES")
  //   //  {
  //   //   this.entidad= new ClienteClass();
  //   //  }
  //   //  if(valor==="GARANTES")
  //   //  {
  //   //   this.entidad= new CXCClass();
  //   //  }
  //   //  if(valor==="TELEFONOS")
  //   //  {
  //   //   this.entidad= new PagosClass();
  //   //  }
  //   //  if(valor==="TRABAJOS")
  //   //  {
  //   //   this.entidad= new TipoCarteraClass();
  //   //  }
  // }

  dataC: CorreoI[] = [];

  LeerArchivo(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const workbook = XLSX.read(e.target.result, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        this.data = XLSX.utils.sheet_to_json(sheet, { header: 1 });
      };
      reader.readAsBinaryString(file);
    }
  }

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  EncerarComponentes() {
    this.TituloPagina = '';
    this.itemFile.patchValue('');
    this.itemFiles.patchValue('');
    this.cargando = false;
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
      } else {
        if (tipo == 0) {
          this.DatosCargaMasiva = this.DatosTemporales.slice(
            this.InicioPaginacion,
            this.FinalPaginacion
          );
        }
      }
    }
  
    BtnNext(tipo: number, rango?: number) {
      if (tipo == 0) {
        if (rango != null) {
          this.FraccionDatos = this.FraccionDatos + this.RangoDatos;
          // this.ListarElementos(2);
        }
        this.InicioPaginacion = this.InicioPaginacion + this.RangoPaginacion;
        this.FinalPaginacion = this.FinalPaginacion + this.RangoPaginacion;
        this.FraccionarValores(0);
      }
    }
  
    BtnPrevious(tipo: number, rango?: number) {
      if (tipo == 0) {
        if (rango != null) {
          this.FraccionDatos = this.FraccionDatos - this.RangoDatos;
          // this.ListarElementos(2);
        }
  
        if (this.InicioPaginacion >= this.RangoPaginacion) {
          this.InicioPaginacion = this.InicioPaginacion - this.RangoPaginacion;
          this.FinalPaginacion = this.FinalPaginacion - this.RangoPaginacion;
          this.FraccionarValores(0);
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
    }
}
