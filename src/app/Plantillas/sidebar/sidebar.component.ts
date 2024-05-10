import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import {
  ResultadoGestorI,
  ResultadoMenuI,
  ResultadoPermisosI,
} from 'src/app/Modelos/login.interface';
import { ApiService } from 'src/app/service/api.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit {
  constructor(
    private router: Router,
    private api: ApiService,
    private cookeService: CookieService
  ) {}

  permisos: ResultadoPermisosI = JSON.parse(localStorage.getItem('usuario')!);

  Menus: ResultadoMenuI[] = this.permisos.menu;
  Gestor: ResultadoGestorI = this.permisos.gestor;
  GestorNombres = this.Gestor.ges_nombres + ' ' + this.Gestor.ges_apellidos;

  MenuAdminitCount!: number;
  MenuClienteCount!: number;
  MenuGestionarExiste: boolean=false;
  async SubMenus() {
    let MenuAdministracion = this.Menus.filter((elemento: any, index: any) => {
      return (
        elemento.men_url === 'menus' ||
        elemento.men_url === 'detallellamadas' ||
        elemento.men_url === 'usuarios' ||
        elemento.men_url === 'cartera' ||
        elemento.men_url === 'tipocartera' ||
        elemento.men_url === 'roles' ||
        elemento.men_url === 'actualizar' ||
        elemento.men_url === 'gestores' ||
        elemento.men_url === 'costosoperacionales' ||
        elemento.men_url === 'tipocorreo' ||
        elemento.men_url === 'tipodireccion' ||
        elemento.men_url === 'tipodocumento' ||
        elemento.men_url === 'tipogestion' ||
        elemento.men_url === 'tipotelefono' ||
        elemento.men_url === 'tipotrabajo' ||
        elemento.men_url === 'conectividad' ||
        elemento.men_url === 'contactabilidad' ||
        elemento.men_url === 'cuenta' ||
        elemento.men_url === 'permisos'

      );
    }).sort((a: any, b: any) => a.men_url.localeCompare(b.men_url));

    let MenuCliente = this.Menus.filter((elemento: any, index: any) => {
      return (
        elemento.men_url === 'cliente' ||
        elemento.men_url === 'correo' ||
        elemento.men_url === 'direccion' ||
        elemento.men_url === 'garante' ||
        elemento.men_url === 'telefono' ||
        elemento.men_url === 'gestion' ||
        elemento.men_url === 'pagos' ||
        elemento.men_url === 'trabajo'
      );
    }).sort((a: any, b: any) => a.men_url.localeCompare(b.men_url));

    let MenuGestionar = this.Menus.filter((elemento: any, index: any) => {
      return (elemento.men_url === 'gestionar');
    }).sort((a: any, b: any) => a.men_url.localeCompare(b.men_url));

    this.MenuAdminitCount = MenuAdministracion.length;
    this.MenuClienteCount = MenuCliente.length;
    this.MenuGestionarExiste = MenuGestionar.length > 0?true:false;
    
  }

  ngOnInit(): void {
    this.SubMenus();
  }
  Menus1: any[] = [
    { number: '2', name: 'Calcular', icon: 'fa-solid fa-calculator',url:'cargar' },
    { number: '3', name: 'Cargar', icon: 'fa-solid fa-upload',url:'cargar' },
    { number: '4', name: 'Descargar', icon: 'fa-solid fa-download',url:'cargar' },
    { number: '5', name: 'Gestionar', icon: 'fa-brands fa-get-pocket',url:'gestionar' },
    { number: '11', name: 'Gestion', icon: 'fa-solid fa-handshake',url:'gestion' },
    {number: '6',name: 'Notificaciones',icon: 'fa-solid fa-triangle-exclamation',url:'cargar'},
    { number: '7', name: 'Pagos', icon: 'fa-solid fa-hand-holding-dollar',url:'pagos' },
    {number: '8',name: 'Reportes',icon: 'fa-solid fa-ranking-star',url: 'reportes',},
    { number: '9', name: 'Ultima Gestion', icon: 'fa-solid fa-chart-line',url:'cargar' },
    { number: '10', name: 'Volver a Llamar', icon: 'fa-solid fa-headset',url:'cargar' },
  ];
}
