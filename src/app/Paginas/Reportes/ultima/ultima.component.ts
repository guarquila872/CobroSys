import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Alertas } from 'src/app/Control/Alerts';
import { ApiService } from 'src/app/service/api.service';
import { Fechas } from 'src/app/Control/Fechas';
import { ResultadoCarteraI, ResultadoGestorI, ResultadoMenuI, ResultadoPermisosI } from 'src/app/Modelos/login.interface';
import { catchError, map } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ContactabilidadI, FiltroGestion, GestionCG, GestorI } from 'src/app/Modelos/response.interface';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx';
import { ngxCsv } from 'ngx-csv';

@Component({
  selector: 'app-ultima',
  templateUrl: './ultima.component.html',
  styleUrls: ['./ultima.component.css']
})
export class UltimaComponent implements OnInit  {
  ListaUltimaGestion:any[]=[];
  ListaGestionar: any[] = [];
  FraccionDatos: number = 0;
  ContadorDatosGeneral: number = 0;
  ParametrosDeDescarga: Array<string> = ['PDF', 'EXCEL', 'CSV'];
  banderaDescargar:boolean=false;
  banderaTodas:boolean=false;
  banderaFiltro:boolean=false;
  @ViewChild('contenido',{static:false})el!:ElementRef
  ngOnInit(): void 
  {
    this.CarterasGestor();
    this.ListarElementosSinGestionar();
  }
  constructor(private api: ApiService,private alerta: Alertas,public Fechas: Fechas,private router: Router) {}
  BuscarForms = new FormGroup({
    identificacion: new FormControl('', Validators.required),
    nombres_cliente: new FormControl('', Validators.required),
    cartera: new FormControl('0', Validators.required),
    gestor: new FormControl('0', Validators.required),
    contactabilidad: new FormControl('0', Validators.required),
    fecha_inicial: new FormControl(
      this.Fechas.fechaActualCorta(),
      Validators.required
    ),
    fecha_final: new FormControl(
      this.Fechas.fechaActualCorta(),
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
      fecha_inicial: this.Fechas.fechaActualCorta(),
      fecha_final: this.Fechas.fechaActualCorta(),
      ultima_gestion: true,
    });
  }
/***********************************************/
 ListaCarteras: any[] = [
    { number: '1', name: 'Marcinex', icon: 'bi bi-list' },
    { number: '2', name: 'Pacifico', icon: 'bi bi-cake2' },
    { number: '3', name: 'Jep', icon: 'bi bi-building' },
    { number: '4', name: 'RM', icon: 'bi bi-battery-half' },
    { number: '5', name: 'Jaher', icon: 'bi bi-bank' },
  ];


  EstadoCliente: any[] = [
    { number: '1', name: 'Contactado', icon: 'bi bi-list' },
    { number: '2', name: 'No Contactado', icon: 'bi bi-cake2' },
    { number: '3', name: 'Compromiso de pago', icon: 'bi bi-building' },
    { number: '4', name: 'Compromiso de incumplido', icon: 'bi bi-battery-half' },
    { number: '5', name: 'Combenio de pago', icon: 'bi bi-bank' },
  ];
  Gestores: any[] = [
    { number: '1', name: 'Juan Perez', icon: 'bi bi-list' },
    { number: '2', name: 'Pedro Perez', icon: 'bi bi-cake2' },
    { number: '3', name: 'Carlos Perez', icon: 'bi bi-building' },
    { number: '4', name: 'Marco Perez', icon: 'bi bi-battery-half' },
    { number: '5', name: 'Maria Perez', icon: 'bi bi-bank' },
  ];
  DatosTemporalesBusqueda: any[] = [];
  getCurrentDate() {
    const startDate = document.getElementById('startDate') as HTMLInputElement;
    const endDate = document.getElementById('endDate') as HTMLInputElement;
    const today = new Date();
    const year = today.getFullYear();
    let month = (today.getMonth() + 1).toString();
    let day = today.getDate().toString();
    month = (Number(month) < 10 ? `0${month}` : month).toString();
    day = (Number(day) < 10 ? `0${day}` : day).toString();

    startDate.value = `${year}-${month}-${day}`;
    endDate.value = `${year}-${month}-${day}`;

    // return `${year}-${month}-${day}`;
  }
  DatosTemporalesBusqueda2: any[] = [];
  CarteraGestor: any[] = [];
  TodasCarteras: number[] = [];
  permisos: ResultadoPermisosI = JSON.parse(localStorage.getItem('usuario')!);
  Cartera: ResultadoCarteraI[] = this.permisos.cartera;
  Usuario: ResultadoGestorI = this.permisos.gestor;
  Menu: ResultadoMenuI[] = this.permisos.menu;
  PaginaActual: ResultadoMenuI = this.Menu.find((elemento) => {
    return elemento.men_url === 'ultima-gestion';
  }) as ResultadoMenuI;
  ConstanteFraccion: number = Number(this.Usuario.usr_fraccion_datos);
  RangoDatos: number = Number(this.Usuario.usr_rango_datos);
  LecturaEscritura: number = Number(this.PaginaActual.men_lectura);
  PaginaNombre: string = this.PaginaActual.men_descripcion;
  loading: boolean = false;
  // ****************************************** PAGINACION *****************************************************************
  DatosCargaMasiva!: any[];
  DatosTemporales: any[] = [];
  ContadorDatos: number = 0;
  RangoPaginacion: number = 0;
  InicioPaginacion: number = 0;
  FinalPaginacion: number = 0;
  FraccionarValores(datos?: any, rango?: number ){
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
      EncerarVariablesPaginacion() {
        this.ContadorDatos = 0;
        this.RangoPaginacion = 0;
        this.InicioPaginacion = 0;
        this.FinalPaginacion = 0;
        this.DatosTemporales = [];
      }
      buscarFiltro(dato:any)
  {
    this.banderaFiltro=true;
    this.banderaTodas=false;
    let filtro:FiltroGestion=
    {
      tipo:1,identificacion:(dato.identificacion.trim()===''?'0':dato.identificacion.trim())!,
      nombres_cliente:(dato.nombres_cliente.trim()===''?'0':dato.nombres_cliente.trim())!,
      cartera:dato.cartera=='0'?this.TodasCarteras:[Number(dato.cartera)],
      gestor:dato.gestor,
      contactabilidad:(dato.nombres_cliente===''?0:Number(dato.contactabilidad))!,
      fecha_inicial:dato.fecha_inicial,
      fecha_final:dato.fecha_final,
      ultima_gestion:dato.ultima_gestion==true?'1':'0'
    }
    
    console.log(this.BuscarForms.value.fecha_inicial);
    console.log(this.BuscarForms.value.fecha_final);
    /***LLamar al servicio de filtro */
    this.ListaUltimaGestion = [];
    this.loading = true;
    this.api
      .GetGestionFracionadoThirdFiltro(filtro)
      .pipe(
        map((tracks) => {
          console.log(tracks['data']);
          this.ListaUltimaGestion = tracks['data'];
          this.DatosTemporalesBusqueda = tracks['data'];
          if (this.ListaUltimaGestion.length === 0) {
            this.loading = false;
            this.alerta.NoExistenDatos();
          } else {
            this.loading = false;
            this.ContadorDatosGeneral = this.ListaUltimaGestion.length;
            this.FraccionarValores(this.ListaUltimaGestion, this.ConstanteFraccion);
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
  ListaContactabilidad: ContactabilidadI[] = [];
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
  /*********************  FILTRO MODO GENERAL *********************** */
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
    const ThGestor = document.getElementById(
      'ThGestor'
    ) as HTMLInputElement;
    const ThNombres = document.getElementById(
      'ThNombres'
    ) as HTMLInputElement;
//ThTipoGestion
const ThTipoGestion = document.getElementById(
  'ThTipoGestion'
) as HTMLInputElement;
    ThNombres.style.color = '';
    ThGestor.style.color = '';
    ThTipoGestion.style.color = '';
    inputElement.disabled = false;
    inputElement.focus();
  }

  FiltrarLista(num: number) {
    const contador = this.TextoFiltro.value!.trim().length!;
    this.EncerarVariablesPaginacion();
    this.TextoFiltro.patchValue(this.TextoFiltro.value!.toUpperCase());
    const ThNombres = document.getElementById(
      'ThNombres'
    ) as HTMLInputElement;
    const ThGestor = document.getElementById(
      'ThGestorAsignado'
    ) as HTMLInputElement;
    const ThTipoGestion = document.getElementById(
      'ThTipoGestion'
    ) as HTMLInputElement;
    if(this.banderaTodas==true&&this.banderaFiltro==false)
      {
        console.log('entro')
        if (this.FirltroPor === 'Nombres') {
          let nombre = this.TextoFiltro.value!;
          if (num === 0) {
            const resultado = this.ListaUltimaGestion.filter((elemento) => {
              return elemento['cli_nombres'].includes(nombre.toUpperCase());
            });
            this.FraccionarValores(resultado, this.ConstanteFraccion);
          }
    
          if (contador != 0) {
            ThNombres.style.color = 'red';
          } else {
            ThNombres.style.color = '';
          }
        }
        if (this.FirltroPor === 'Gestor') {
          let nombre = this.TextoFiltro.value!;
          if (num === 0) {
            const resultado = this.ListaUltimaGestion.filter((elemento) => {
              return elemento['nombreGestorAsig'].includes(nombre.toUpperCase());
            });
            this.FraccionarValores(resultado, this.ConstanteFraccion);
          }
    
          if (contador != 0) {
            ThGestor.style.color = 'red';
          } else {
            ThGestor.style.color = '';
          }
        }
        if (this.FirltroPor === 'TipoGestion') {
          let nombre = this.TextoFiltro.value!;
          if (num === 0) {
            const resultado = this.ListaUltimaGestion.filter((elemento) => {
              return elemento['gestion_tip_descripcion'].includes(nombre.toUpperCase());
            });
            this.FraccionarValores(resultado, this.ConstanteFraccion);
          }
    
          if (contador != 0) {
            ThTipoGestion.style.color = 'red';
          } else {
            ThTipoGestion.style.color = '';
          }
        }
      }
      if(this.banderaFiltro===true&&this.banderaTodas===false)
        {
          if (this.FirltroPor === 'Nombres') {
            let nombre = this.TextoFiltro.value!;
            if (num === 0) {
              const resultado = this.ListaUltimaGestion.filter((elemento) => {
                return elemento.Gestion.Cliente.cli_nombres.includes(nombre.toUpperCase());
              });
              this.FraccionarValores(resultado, this.ConstanteFraccion);
            }
      
            if (contador != 0) {
              ThNombres.style.color = 'red';
            } else {
              ThNombres.style.color = '';
            }
          }
          if (this.FirltroPor === 'Gestor') {
            let nombre = this.TextoFiltro.value!;
            if (num === 0) {
              const resultado = this.ListaUltimaGestion.filter((elemento) => {
                return elemento.GestorAsignado.includes(nombre.toUpperCase());
              });
              this.FraccionarValores(resultado, this.ConstanteFraccion);
            }
      
            if (contador != 0) {
              ThGestor.style.color = 'red';
            } else {
              ThGestor.style.color = '';
            }
          }
          if (this.FirltroPor === 'TipoGestion') {
            let nombre = this.TextoFiltro.value!;
            if (num === 0) {
              const resultado = this.ListaUltimaGestion.filter((elemento) => {
                return elemento.TipoGestion.includes(nombre.toUpperCase());
              });
              this.FraccionarValores(resultado, this.ConstanteFraccion);
            }
      
            if (contador != 0) {
              ThTipoGestion.style.color = 'red';
            } else {
              ThTipoGestion.style.color = '';
            }
          }
        }
    
  }
  VaciarFiltro() {
    const inputElement = document.getElementById(
      'TxtFiltro'
    ) as HTMLInputElement;
    const ThNombres = document.getElementById(
      'ThNombres'
    ) as HTMLInputElement;
    const ThGestor = document.getElementById(
      'ThGestorAsignado'
    ) as HTMLInputElement;
    const ThTipoGestion = document.getElementById(
      'ThTipoGestion'
    ) as HTMLInputElement;
    ThGestor.style.color = '';
    ThNombres.style.color = '';
    ThTipoGestion.style.color = '';
    inputElement.disabled = true;
    this.FirltroPor = '';
    this.TextoFiltro.patchValue('');
    this.FraccionarValores(
      this.DatosTemporalesBusqueda,
      this.ConstanteFraccion
    );
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
  ListarElementos(num: number) {
    // this.GetBusquedaPor('');
    this.banderaTodas=true;
    this.banderaFiltro=false;
    if (num === 1) {
      this.ListaUltimaGestion = [];
      this.FraccionDatos = 0;
    }

    this.ListaUltimaGestion = [];
    this.loading = true;
    this.api
      .GetGestionFracionado3(this.FraccionDatos, this.RangoDatos)
      .pipe(
        map((tracks) => {
          this.ListaUltimaGestion = tracks['data'];
          console.log(this.ListaUltimaGestion);
          this.banderaDescargar=true;
          this.DatosTemporalesBusqueda2 = tracks['data'];
          console.log("---------------------------------------------------------------------");
          console.log(this.DatosTemporalesBusqueda2);
          console.log("---------------------------------------------------------------------");
          if (this.ListaUltimaGestion.length === 0) {
            this.loading = false;
            this.alerta.NoExistenDatos();
          } else {
            this.loading = false;
            this.ContadorDatosGeneral = this.ListaUltimaGestion.length;
            this.FraccionarValores(this.ListaUltimaGestion, this.ConstanteFraccion);
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
  GetDescargaPor(val:string)
  {
    console.log(val);
    if(val==='PDF')
    {
      this.descargarPDF();
    }
    if(val==='EXCEL')
    {
      this.excel();
    }
    if(val==='CSV')
    {
      this.csv();
    }
  }
  csv() {
   console.log('csv');
   var opciones=
  {
    title:this.PaginaNombre,
    fieldSeparator:',',
    quoteStrings:'"',
    showLabels:false,
    noDownload:false,
    useBom:false,
    headers:this.getKeys()
  };

  new ngxCsv(this.ListaUltimaGestion,"reporte",opciones);

  }
  excel() {
    console.log('excel');
    const fechaActual = new Date();
    const opciones = { timeZone: 'America/Guayaquil' };
    const fecha = fechaActual.toLocaleString('es-EC', opciones);

    let filename: string = `${fecha.substring(0, fecha.length - 3)}_reporte.xlsx`;

    const ws = XLSX.utils.json_to_sheet(this.ListaUltimaGestion);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, this.PaginaNombre);
    /* save to file */
    XLSX.writeFile(wb, filename);

  }
  descargarPDF() {
    console.log('pdf')
    const fechaActual = new Date();
    const opciones = { timeZone: 'America/Guayaquil' };
    const fecha = fechaActual.toLocaleString('es-EC', opciones);
    const DATA = document.getElementById('contenido');
    const doc = new jsPDF('p', 'pt', 'a4');
    const options = {
      background: 'white',
      scale: 3
    };
    html2canvas(DATA!, options).then((canvas) => {

      const img = canvas.toDataURL('image/PNG');

      // Add image Canvas to PDF
      const bufferX = 60;
      const bufferY = 60;
      const imgProps = (doc as any).getImageProperties(img);
      const pdfWidth = doc.internal.pageSize.getWidth() - 2 * bufferX;
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      doc.addImage(img, 'PNG', bufferX, bufferY, pdfWidth, pdfHeight, undefined, 'FAST');
      const textX = 60;
      const textY = 45;
     doc.text(this.PaginaNombre, textX, textY);
     //doc.text(this.usuario,textX,textY)
     doc.text(fecha.substring(0,fecha.length-3),textX+350,textY);

      return doc;
    }).then((docResult) => {
      docResult.save(`${fecha.substring(0,fecha.length-3)}_reporte.pdf`);
    });

  }
  getKeys(): string[] {
    if (this.ListaUltimaGestion.length > 0) {
      return Object.keys(this.ListaUltimaGestion[0]);
    }
    return [];
  }
/******************************************************************** */
getGestionesDiarias(valor:any[]):number
{
  let val:number=0;
  if ((this.getKeys2(valor)).length === 49) {
    valor.filter(elemento => {
      if (this.Fechas.fechaCorta(elemento['gest_fecha_gestion']) === this.Fechas.fechaActualCorta2()) {
        val += 1;
      }

    });
  }else
  {
    valor.filter(elemento => {
      if (this.Fechas.fechaCorta(elemento.Gestion['gest_fecha_gestion']) === this.Fechas.fechaActualCorta2()) {
        val += 1;
      }

    });
  }
  return val;
}
getGestionesMes(valor:any[]):number
{
  let val:number=0;
  if((this.getKeys2(valor)).length === 49){
  valor.filter(elemento=>
    {
      if(this.obtenerMesAnio(this.Fechas.fechaCorta(elemento['gest_fecha_gestion']),'MES')===this.obtenerMesAnio(this.Fechas.fechaActualCorta2(),'MES'))
        {
          val+=1;
        }
    });
  }else
  {
    valor.filter(elemento => {
      if (this.Fechas.fechaCorta(elemento.Gestion['gest_fecha_gestion']) === this.Fechas.fechaActualCorta2()) {
        val += 1;
      }

    });
  }
  return val;
}
getGestionesYear(valor:any[]):number
{
  let val:number=0;
  if((this.getKeys2(valor)).length === 49){
  valor.filter(elemento=>
    {
      if(this.obtenerMesAnio(this.Fechas.fechaCorta(elemento['gest_fecha_gestion']),'ANIO')===this.obtenerMesAnio(this.Fechas.fechaActualCorta2(),'ANIO'))
        {
          val+=1;
        }

    });
  }else
  {
    valor.filter(elemento => {
      if (this.Fechas.fechaCorta(elemento.Gestion['gest_fecha_gestion']) === this.Fechas.fechaActualCorta2()) {
        val += 1;
      }

    });
  }
  return val;
}
obtenerMesAnio(valor:string,parametro:string):string
{
  let val:string='';
  const partes = valor.split('-');
  if (parametro.toUpperCase() === 'MES') {
    val = partes[1];
  }
  if (parametro.toUpperCase() === 'ANIO') {
    val = partes[2];
  }

  return val;
}
/****************************Listar Listado sin gestionar****************************** */
ListarElementosSinGestionar() {
  let filtro: GestionCG = {
    identificacion:'0',
    nombres_cliente:'0',
    cartera:this.TodasCarteras,
    // cartera: [7,10],
    gestor: Number(this.Usuario.id_gestor),
    contactabilidad:0,
    pago:'0',
    prioridad:'0',
    monto_min:'0',
    monto_max:'0',
    meses:0,
    tipo: 0,
    codigo:0,
    rango:0
  };
  this.loading = true;
  this.ListaGestionar = [];
  this.api
    .GetGestionarFracionado(filtro)
    .pipe(
      map((tracks) => {
        console.log(tracks['data']);
        this.ListaGestionar = tracks['data'];
        //this.DatosTemporalesBusqueda = tracks['data'];
        if (this.ListaGestionar.length === 0) {
          this.loading = false;
          this.alerta.NoExistenDatos();
        } else {
         
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
/************************************************************** */
getKeys2(valor:any[]): string[] {
  if (this.ListaUltimaGestion.length > 0) { // Checks if ListaResultado array has elements
    return Object.keys(valor[0]); // Returns the keys of the first object in ListaResultado array
}
return []; // Returns an empty array if ListaResultado is empty
}
}
