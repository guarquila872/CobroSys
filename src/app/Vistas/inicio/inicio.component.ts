import { Component, Injectable, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

import {
  ApexNonAxisChartSeries,
  ApexPlotOptions,
  ApexChart,
  ApexFill,
  ChartComponent,
  ApexStroke,
  ApexXAxis,
  ApexDataLabels,
  ApexYAxis,
  ApexTitleSubtitle,
  ApexLegend,
  ApexAxisChartSeries,
  ApexTooltip,
  ApexGrid,
  ApexMarkers,
} from 'ng-apexcharts';
import { AUTO_STYLE } from '@angular/animations';
import {
  ResultadoGestorI,
  ResultadoMenuI,
  ResultadoPermisosI,
} from 'src/app/Modelos/login.interface';
import { Fechas } from 'src/app/Control/Fechas';
import { Alertas } from 'src/app/Control/Alerts';
import { ApiService } from 'src/app/service/api.service';
import { catchError, map } from 'rxjs';
import { auto } from '@popperjs/core';

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  labels: string[];
  plotOptions: ApexPlotOptions;
  fill: ApexFill;
  stroke: ApexStroke | any;
  /////////////////////////////////
  series1: ApexAxisChartSeries;
  xaxis: ApexXAxis;
  dataLabels: ApexDataLabels;
  title: ApexTitleSubtitle;
  legend: ApexLegend;
  subtitle: ApexTitleSubtitle;
  grid: ApexGrid;

  //////////////////////////////////
  // series: ApexAxisChartSeries;
  // chart: ApexChart;
  // xaxis: ApexXAxis;
  markers: any | ApexMarkers;
  yaxis: ApexYAxis | ApexYAxis[];
  // dataLabels: ApexDataLabels;
  colors: string[];
  // title: ApexTitleSubtitle;
  // subtitle: ApexTitleSubtitle;
  // legend: ApexLegend;
  // fill: ApexFill;
  tooltip: ApexTooltip;
};
declare global {
  interface Window {
    Apex: any;
  }
}

const sparkLineData = [
  47, 45, 54, 38, 56, 24, 65, 31, 37, 39, 62, 51, 35, 41, 35, 27, 93, 53, 61,
  27, 54, 43, 19, 46,
];
@Injectable({
  providedIn: 'root',
})
@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css'],
})
export class InicioComponent implements OnInit {
  constructor(
    private api: ApiService,
    private alerta: Alertas,
    public fechas: Fechas,
    private router: Router,
    private cookeService: CookieService
  ) {}
  ngOnInit(): void {
    this.randomImageUrl = this.RandomImage();

    if (this.Rol != 'ADMINISTRADOR' && this.Rol != 'SUPERVISOR') {
      this.InformacionPrincipal();
    }
  }
  checkLocal() {
    if (
      !this.cookeService.get('token_cs') ||
      !this.cookeService.get('usuarioId') ||
      !localStorage.getItem('usuario')
    ) {
      this.router.navigate(['login']);
    }
  }

  permisos: ResultadoPermisosI = JSON.parse(localStorage.getItem('usuario')!);
  Usuario: ResultadoGestorI = this.permisos.gestor;
  Rol: string = this.Usuario.ges_rol;
  Menu: ResultadoMenuI[] = this.permisos.menu;
  PaginaActual: ResultadoMenuI = this.Menu.find((elemento) => {
    return elemento.men_url === 'inicio';
  }) as ResultadoMenuI;
  ConstanteFraccion: number = Number(this.Usuario.usr_fraccion_datos);
  RangoDatos: number = Number(this.Usuario.usr_rango_datos);
  LecturaEscritura: number = Number(this.PaginaActual.men_lectura);
  PaginaNombre: string = this.PaginaActual.men_descripcion;
  loading: boolean = false;
  ///////////////////////////////////////   ANIMACION IMAGEN    //////////////////////////////////////////////////
  imageUrls: string[] = [
    // 'home0.gif',
    // 'home1.gif',
    // 'home2.gif',
    'home3.gif',
    // 'home4.gif',
    'home5.gif',
    'home6.gif',
    'home7.gif',
    'home8.gif',
    // 'home9.gif',
    // 'home10.gif',
    // 'home11.gif',
  ];
  randomImageUrl: string = '';

  RandomImage(): string {
    const randomIndex = Math.floor(Math.random() * this.imageUrls.length);
    return this.imageUrls[randomIndex];
  }
  ///////////////////////////////////////   GRAFICOS PRIMERA FILA    //////////////////////////////////////////////////
  public chartOptionsGraficoPie!: Partial<ChartOptions>;
  public chartOptions!: Partial<ChartOptions>;
  public chartOptionsTotal!: Partial<ChartOptions>;
  public chartOptionsGestionados!: Partial<ChartOptions>;
  public ValoresDeRecuperacion!: Partial<ChartOptions>;
  public ValoresPorConfirmar!: Partial<ChartOptions>;

  GraficoArea() {
    let fechas_pagos: any[] = [];
    let valor_pagos: any[] = [];
    for (let datos of this.InicioDatos.pagos) {
      fechas_pagos.push(datos.fecha);
      valor_pagos.push(datos.valor);
    }
    this.ValoresDeRecuperacion = {
      series1: [
        {
          name: 'Pago',
          data: valor_pagos,
        },
      ],
      chart: {
        type: 'area',
        height: 130,
        zoom: {
          enabled: false,
        },
        toolbar: {
          show: false,
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        width: 5,
        curve: 'straight',
        dashArray: [0, 8, 5],
      },
      // title: {
      //   // text: 'Fundamental Analysis of Stocks',
      //   // align: 'left',
      //   offsetX: 0,
      // },
      // subtitle: {
      //   // text: "Price Movements",
      //   // align: "left",
      //   offsetX: 0,
      // },
      labels: fechas_pagos,
      xaxis: {
        type: 'datetime',
        labels: {
          show: false,
        },
      },
      yaxis: {
        show: false,
        reversed: false,
      },
      grid: {
        show: false,
      },
      legend: {
        horizontalAlign: 'left',
      },
    };

    // this.ValoresPorConfirmar = {
    //   series1: [
    //     {
    //       name: 'STOCK ABC',
    //       data: valor_pagos,
    //     },
    //   ],
    //   chart: {
    //     type: 'area',
    //     height: 130,
    //     zoom: {
    //       enabled: false,
    //     },
    //     toolbar: {
    //       show: false,
    //     },
    //   },
    //   dataLabels: {
    //     enabled: false,
    //   },
    //   stroke: {
    //     width: 5,
    //     curve: 'straight',
    //     dashArray: [0, 8, 5],
    //   },
    //   // title: {
    //   //   // text: 'Fundamental Analysis of Stocks',
    //   //   // align: 'left',
    //   //   offsetX: 0,
    //   // },
    //   // subtitle: {
    //   //   // text: "Price Movements",
    //   //   // align: "left",
    //   //   offsetX: 0,
    //   // },
    //   labels: fechas_pagos,
    //   xaxis: {
    //     type: 'datetime',
    //     labels: {
    //       show: false,
    //     },
    //   },
    //   yaxis: {
    //     show: false,
    //     reversed: false,
    //   },
    //   grid: {
    //     show: false,
    //   },
    //   legend: {
    //     horizontalAlign: 'left',
    //   },
    // };
  }
  PorcentajeRecuperacion() {
    const porcentajeUsuarios = (
      this.InicioDatos != undefined
        ? ((this.InicioDatos.pagos_conf + this.InicioDatos.pagos_sin_conf) /
            this.InicioDatos.meta_planteada) *
          100
        : 0
    ).toFixed(1);

    const porcentajeComoNumero = parseFloat(porcentajeUsuarios);

    this.chartOptions = {
      series: [porcentajeComoNumero],
      chart: {
        height: 300,
        type: 'radialBar',
        offsetY: -70,
      },
      plotOptions: {
        radialBar: {
          startAngle: -135,
          endAngle: 135,
          dataLabels: {
            name: {
              fontSize: '12px',
              color: undefined,
              offsetY: 0,
            },
            value: {
              offsetY: 35,
              fontSize: '22px',
              color: undefined,
              formatter: function (val) {
                return val + '%';
              },
            },
          },
        },
      },
      fill: {
        type: 'gradient',
        gradient: {
          shade: 'dark',
          shadeIntensity: 0.15,
          inverseColors: true,
          opacityFrom: 1,
          opacityTo: 1,
          stops: [0, 50, 65, 91],
        },
      },
      stroke: {
        dashArray: 3,
      },
      labels: ['Recuperacion mensual'],
    };

    const porcentajeUsuariosTotal = (
      this.InicioDatos != undefined
        ? (this.InicioDatos.total_pagos / this.InicioDatos.tota_asignado) * 100
        : 0
    ).toFixed(1);

    const porcentajeComoNumeroTotal = parseFloat(porcentajeUsuariosTotal);

    this.chartOptionsTotal = {
      series: [porcentajeComoNumeroTotal],
      chart: {
        height: 300,
        type: 'radialBar',
        offsetY: -70,
      },
      plotOptions: {
        radialBar: {
          startAngle: -135,
          endAngle: 135,
          dataLabels: {
            name: {
              fontSize: '12px',
              color: undefined,
              offsetY: 0,
            },
            value: {
              offsetY: 35,
              fontSize: '22px',
              color: undefined,
              formatter: function (val) {
                return val + '%';
              },
            },
          },
        },
      },
      fill: {
        type: 'gradient',
        gradient: {
          shade: 'dark',
          shadeIntensity: 0.15,
          inverseColors: true,
          opacityFrom: 1,
          opacityTo: 1,
          stops: [0, 50, 65, 91],
        },
      },
      stroke: {
        dashArray: 3,
      },
      labels: ['R. Total A.'],
    };

    const gestionados = (
      this.InicioDatos != undefined
        ? (this.InicioDatos.con_gestion / this.InicioDatos.clientes) * 100
        : 0
    ).toFixed(1);

    const porcentajeGestionados = parseFloat(gestionados);

    this.chartOptionsGestionados = {
      series: [porcentajeGestionados],
      chart: {
        height: 300,
        type: 'radialBar',
        offsetY: -70,
      },
      plotOptions: {
        radialBar: {
          startAngle: -135,
          endAngle: 135,
          dataLabels: {
            name: {
              fontSize: '12px',
              color: undefined,
              offsetY: 0,
            },
            value: {
              offsetY: 35,
              fontSize: '22px',
              color: undefined,
              formatter: function (val) {
                return val + '%';
              },
            },
          },
        },
      },
      fill: {
        type: 'gradient',
        gradient: {
          shade: 'dark',
          shadeIntensity: 0.15,
          inverseColors: true,
          opacityFrom: 1,
          opacityTo: 1,
          stops: [0, 50, 65, 91],
        },
      },
      stroke: {
        dashArray: 3,
      },
      labels: ['T. Gestionados'],
    };

    this.chartOptionsGraficoPie = {
      series1: [
        {
          name: 'TEAM A',
          type: 'column',
          data: [
            23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30, 23, 11, 22, 27, 13, 22,
            37, 21, 44, 22, 30,
          ],
        },
        {
          name: 'TEAM B',
          type: 'area',
          data: [
            44, 55, 41, 67, 22, 43, 21, 41, 56, 27, 43, 23, 11, 22, 27, 13, 22,
            37, 21, 44, 22, 30,
          ],
        },
        {
          name: 'TEAM C',
          type: 'line',
          data: [
            30, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39, 23, 11, 22, 27, 13, 22,
            37, 21, 44, 22, 30,
          ],
        },
        {
          name: 'TEAM D',
          type: 'line',
          data: [
            35, 64, 52, 59, 36, 39, 30, 25, 36, 30, 45, 23, 11, 22, 27, 13, 22,
            37, 21, 44, 22, 30,
          ],
        },
      ],
      chart: {
        width: '100%',
        height: '350',
        type: 'line',
        stacked: false,
      },
      stroke: {
        width: [0, 1, 1, 1],
        curve: 'smooth',
        dashArray: [0, 0, 0, 3],
      },
      plotOptions: {
        bar: {
          columnWidth: '50%',
        },
      },

      fill: {
        opacity: [0.85, 0.25, 1, 1],
        gradient: {
          inverseColors: false,
          shade: 'light',
          type: 'vertical',
          opacityFrom: 0.85,
          opacityTo: 0.55,
          stops: [0, 100, 100, 100],
        },
      },
      labels: [
        '01/01/2003',
        '01/02/2003',
        '01/03/2003',
        '01/04/2003',
        '01/05/2003',
        '01/06/2003',
        '01/07/2003',
        '01/08/2003',
        '01/09/2003',
        '01/10/2003',
        '01/11/2003',
        '01/12/2003',
        '01/13/2003',
        '01/14/2003',
        '01/15/2003',
        '01/16/2003',
        '01/17/2003',
        '01/18/2003',
        '01/19/2003',
        '01/20/2003',
        '01/21/2003',
        '01/21/2003',
      ],
      markers: {
        size: 0,
      },
      xaxis: {
        type: 'datetime',
      },
      yaxis: {
        title: {
          text: 'Points',
        },
        min: 0,
      },
      tooltip: {
        shared: true,
        intersect: false,
        y: {
          formatter: function (y) {
            if (typeof y !== 'undefined') {
              return y.toFixed(0) + ' points';
            }
            return y;
          },
        },
      },
    };
  }

  ///////////////////////////////////////   MANEJO DE NOTIFICACIONES InformacionPrincipal  //////////////////////////////////////////////////

  InicioDatos: any | null = null;
  InformacionPrincipal() {
    const CargandoLoad = document.getElementById(
      'Cargando'
    ) as HTMLInputElement;
    CargandoLoad.classList.add('modal--show');
    this.InicioDatos = null;
    // this.loading = true;
    this.api
      .GetNotificacionFracionado(10)
      .pipe(
        map((tracks) => {
          let datos = tracks['data'];
          console.log(datos);
          this.InicioDatos = datos;
          this.TotalNotificaciones();
          this.PorcentajeRecuperacion();
          this.GraficoArea();

          CargandoLoad.classList.remove('modal--show');
        }),
        catchError((error) => {
          CargandoLoad.classList.remove('modal--show');
          this.alerta.ErrorAlRecuperarElementos();
          throw new Error(error);
        })
      )
      .subscribe();
  }

  TotalNotificaciones() {
    this.ListaNotificaciones = [];
    this.ListaVolverLLamar = [];
    this.ListaCombeniosCompomisos = [];
    this.ListaCombeniosCompomisosP = [];
    this.ListaCCConPagos = [];

    this.api
      .GetNotificacionFracionado(11)
      .pipe(
        map((tracks) => {
          let datos = tracks['data'];
          console.log(datos);
          this.ListaNotificaciones = datos.notificacion;
          this.ListaVolverLLamar = datos.volver_llamar;
          this.ListaCombeniosCompomisos = datos.compromisosHoy;
          this.ListaCombeniosCompomisosP = datos.compromisosAnt;
          this.ListaCCConPagos = datos.cambio_estado;
        }),
        catchError((error) => {
          // this.loading = false;
          this.alerta.ErrorAlRecuperarElementos();
          throw new Error(error);
        })
      )
      .subscribe();
  }

  ///////////////////////////////////////   MANEJO DE NOTIFICACIONES DE GESTOR A GESTOR   //////////////////////////////////////////////////

  ListaNotificaciones: any[] = [];
  ListarNotificaciones() {
    this.ListaNotificaciones = [];
    this.loading = true;
    this.api
      .GetNotificacionFracionado(0)
      .pipe(
        map((tracks) => {
          let datos = tracks['data'];
          this.ListaNotificaciones = datos;
          this.loading = false;
        }),
        catchError((error) => {
          this.loading = false;
          this.alerta.ErrorAlRecuperarElementos();
          throw new Error(error);
        })
      )
      .subscribe();
  }
  Gestionar(datos: any) {
    this.alerta
      .MensajeConfirmacion('Mensaje asimilado', 'Gestionar cliente')
      .then((confirmado) => {
        if (confirmado) {
          this.router.navigate([
            '/gestionar',
            datos.Notificacion.cli_identificacion,
            datos.Notificacion.not_id_cartera,
            0,
          ]);
          this.NotificacionRevisada(datos);
        }
      });
  }
  NotificacionRevisada(datos: any) {
    let not = datos.Notificacion;
    not.not_visto = '1';
    not.not_fecha_vis = this.fechas.fechaActualCorta();
    not.not_hora_vis = this.fechas.HoraActual();
    this.api
      .PutNotificacion(not)
      .pipe(
        map((track) => {
          let exito = track['exito'];
          if (exito == 1) {
            this.alerta.MensajeSuperiorDerechaSuccess('Notificacion revisada');
            this.ListarNotificaciones();
          }
        })
      )
      .subscribe();
  }
  ///////////////////////////////////////   MANEJO DE NOTIFICACIONES VOLVER A LLAMAR   //////////////////////////////////////////////////
  ListaVolverLLamar: any[] = [];
  ListarVolverLlamar() {
    this.ListaVolverLLamar = [];
    this.loading = true;
    this.api
      .GetNotificacionFracionado(1)
      .pipe(
        map((tracks) => {
          let datos = tracks['data'];
          this.ListaVolverLLamar = datos;
          this.loading = false;
        }),
        catchError((error) => {
          this.loading = false;
          this.alerta.ErrorAlRecuperarElementos();
          throw new Error(error);
        })
      )
      .subscribe();
  }
  GestionarVL(datos: any) {
    this.alerta
      .MensajeConfirmacion('Mensaje asimilado', 'Gestionar cliente')
      .then((confirmado) => {
        if (confirmado) {
          this.router.navigate([
            '/gestionar',
            datos.cli_identificacion,
            datos.gest_id_cartera,
            0,
          ]);
          this.VolverLlamarOk(datos);
        }
      });
  }
  VolverLlamarOk(datos: any) {
    let gestion = datos.id_gestion;
    this.api
      .GetNotificacionFracionadoFiltro(gestion, 0)
      .pipe(
        map((track) => {
          let exito = track['exito'];
          if (exito == '1') {
            this.alerta.MensajeSuperiorDerechaSuccess('Notificacion revisada');
            this.ListarVolverLlamar();
          }
        })
      )
      .subscribe();
  }
  ///////////////////////////////////////   REDIRECCION DESDE NOTIFICACIONES  //////////////////////////////////////////////////
  ListaCombeniosCompomisos: any[] = [];
  GestionarCC(datos: any) {
    this.router.navigate([
      '/gestionar',
      datos.cli_identificacion,
      datos.gest_id_cartera,
      0,
    ]);
  }
  ListaCombeniosCompomisosP: any[] = [];
  GestionarCCP(datos: any) {
    this.alerta;
    this.router.navigate([
      '/gestionar',
      datos.cli_identificacion,
      datos.gest_id_cartera,
      0,
    ]);
  }
  ListaCCConPagos: any[] = [];
  GestionarCCConPagos(datos: any) {
    console.log(datos);
    this.router.navigate([
      '/gestionar',
      datos.cli_identificacion,
      datos.id_cartera,
      0,
    ]);
  }

  // ****************************************** ADMINISTRADORES  *****************************************************************
  
 
}

