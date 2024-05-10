import { Component, Injectable } from '@angular/core';
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
import { of, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class Permisos {
  constructor(
    private api: ApiService,
    private alerta: Alertas,
    public Fechas: Fechas,
    private cookeService: CookieService
  ) {}
 
 
  GuardarObjeto(datos: any,menu:any,cartera:any,titulo:string) {
    datos.perm_esactivo = datos.perm_esactivo.toString() === 'true' ? '1' : '0';
    let PermisosDetMenu: PermisoDetalleMI[] = [];
    for (let datos of menu) {
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

    for (let datos of cartera) {
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
    this.GuardarObjetoConDetalle(datos,titulo);
  }
  
  
 

  
  GuardarObjetoConDetalle(datos: PermisosI, titulo: string): Observable<boolean> {
    if (titulo === 'Editar') {
      return this.api.PutPermisos(datos).pipe(
        map((tracks) => {
          const exito = tracks['exito'];
          return exito === 1;
        }),
        catchError((error) => {
          console.error(error);
          return of(false);
        })
      );
    } else {
      return this.api.PostPermisos(datos).pipe(
        map((tracks) => {
          const exito = tracks['exito'];
          return exito === 1;
        }),
        catchError((error) => {
          console.error(error);
          return of(false);
        })
      );
    }
  }
  

  
  


}
