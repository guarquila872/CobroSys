import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpEvent,
  HttpHandler,
  HttpHeaders,
  HttpParams,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Encriptacion } from '../Control/EncryptDescrypt';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Observable, catchError, map, throwError } from 'rxjs';
import {
  CarteraI,
  ClienteI,
  ConectividadI,
  ContactabilidadI,
  CorreoI,
  CuentaI,
  CxcOperacionI,
  DetalleTelefonoI,
  DireccionI,
  EntidadEncriptado,
  FiltroGestion,
  FiltroPagos,
  GaranteI,
  GestionCG,
  GestionI,
  GestionarPropio,
  GestorI,
  MenuI,
  NotificacionI,
  PagosI,
  PermisosI,
  RecargoI,
  ResponseI,
  RolesI,
  TelefonoI,
  Tipo_CarteraI,
  Tipo_CorreoI,
  Tipo_DireccionI,
  Tipo_Doc_AdicionalI,
  Tipo_GestionI,
  Tipo_RecargoI,
  Tipo_TelefonoI,
  Tipo_TrabajoI,
  TrabajoI,
  UsuariosI,
} from '../Modelos/response.interface';
import { LoginI } from '../Modelos/login.interface';
import Swal from 'sweetalert2';
import { AuthInterceptorService } from '../Control/jwt-interceptor.interceptor';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
    private router: Router // private alerta: Alertas // private tokenInterceptor: AuthInterceptorService
  ) {}
  objeto = new Encriptacion();

  //   url: string = 'http://192.168.0.86:8090/api/';
  // url: string = 'https://cobrosystemapi.cobrosystem.com/api/';
  // url: string = 'https://localhost:7276/api/';
  url: string = 'https://localhost:7232/api/';

  /********************** INICIAR Y CERRAR SESION *************************** */

  PostIniciarSesion(loginData: LoginI): Observable<ResponseI> {
    let Encryptado: EntidadEncriptado = {
      valor: this.objeto.encriptarAES(loginData),
    };
    let direccion = this.url + 'Login';
    return this.http.post<any>(direccion, Encryptado).pipe(
      map((data) => {
        return JSON.parse(this.objeto.decrypt(data['valor']));
      }),
      catchError((error) => {
        console.error('Error al obtener y desencriptar los datos', error);
        // this.alerta.PeticionModificada();
        throw error;
      })
    );
  }

  GetCerrarSesion(): Observable<ResponseI> {
    let direccion = this.url + 'Login/CerrarSesion';
    return this.http.get<any>(direccion).pipe(
      map((data) => {
        return JSON.parse(this.objeto.decrypt(data['valor']));
      }),
      catchError((error) => {
        console.error('Error al obtener y desencriptar los datos', error);
        throw error;
      })
    );
  }
  SesionEnOtroDispocitivo() {
    Swal.fire({
      // position: 'top-end',
      icon: 'warning',
      title: 'El usuario inicio sesión en otro Dispositivo',
      showConfirmButton: false,
      timer: 2000,
    });
    localStorage.removeItem('usuario');
    this.cookieService.delete('token_cs');
    this.cookieService.delete('usuarioId');
    this.cookieService.delete('cartera_desc');
    this.cookieService.delete('id_cartera');
    this.cookieService.delete('token');
    this.cookieService.delete('usuario_sd');
    this.router.navigate(['login']);
  }
  GetRestablecerUsuario(usuario:string): Observable<ResponseI> {
    let direccion = this.url + 'Login/Restablecer'+usuario;
    return this.http.get<any>(direccion).pipe(
      map((data) => {
        return JSON.parse(this.objeto.decrypt(data['valor']));
      }),
      catchError((error) => {
        console.error('Error al obtener y desencriptar los datos', error);
        throw error;
      })
    );
  }

  GetEnvioMensaje(mensaje:string, user:string, para: number): Observable<ResponseI> {
    let direccion = this.url + 'Chat/'+mensaje+','+user+','+para;
    return this.http.get<any>(direccion).pipe();
  }
  //********************* TOKEN *********************** */
  GetTokenExiste(): Observable<ResponseI> {
    let direccion = this.url + 'Tokens';
    return this.http.get<any>(direccion).pipe(
      map((data) => {
        return JSON.parse(this.objeto.decrypt(data['valor']));
      }),
      catchError((error) => {
        console.error('Error al obtener y desencriptar los datos', error);
        throw error;
      })
    );
  }

  //********************* CARTERA *********************** */
  GetCarteraFracionado(codigo: number, rango: number): Observable<ResponseI> {
    let direccion = this.url + 'Cartera/Todos' + codigo + ',' + rango;
    return this.http.get<any>(direccion).pipe(
      map((data) => {
        return JSON.parse(this.objeto.decrypt(data['valor']));
      }),
      catchError((error) => {
        console.error('Error al obtener y desencriptar los datos', error);
        throw error;
      })
    );
  }
  GetCarteraFracionadoFiltro(
    variable: string,
    tipo: number
  ): Observable<ResponseI> {
    let direccion = this.url + 'Cartera/Filtro' + variable + ',' + tipo;
    return this.http.get<any>(direccion).pipe(
      map((data) => {
        return JSON.parse(this.objeto.decrypt(data['valor']));
      }),
      catchError((error) => {
        console.error('Error al obtener y desencriptar los datos', error);
        throw error;
      })
    );
  }
  PostCartera(elemento: CarteraI): Observable<any> {
    let Encryptado: EntidadEncriptado = {
      valor: this.objeto.encriptarAES(elemento),
    };
    let direccion = this.url + 'Cartera';
    return this.http.post<any>(direccion, Encryptado).pipe(
      map((data) => {
        return JSON.parse(this.objeto.decrypt(data['valor']));
      }),
      catchError((error) => {
        console.error('Error al obtener y desencriptar los datos', error);
        throw error;
      })
    );
  }
  PutCartera(elemento: CarteraI): Observable<any> {
    let Encryptado: EntidadEncriptado = {
      valor: this.objeto.encriptarAES(elemento),
    };
    let direccion = this.url + 'Cartera';
    return this.http.put<any>(direccion, Encryptado).pipe(
      map((data) => {
        return JSON.parse(this.objeto.decrypt(data['valor']));
      }),
      catchError((error) => {
        console.error('Error al obtener y desencriptar los datos', error);
        throw error;
      })
    );
  }
  //********************* CLIENTES *********************** */
  GetClienteFracionado(codigo: number, rango: number): Observable<ResponseI> {
    let direccion = this.url + 'Cliente/Todos' + codigo + ',' + rango;
    return this.http.get<any>(direccion).pipe(
      map((data) => {
        return JSON.parse(this.objeto.decrypt(data['valor']));
      }),
      catchError((error) => {
        console.error('Error al obtener y desencriptar los datos', error);
        throw error;
      })
    );
  }
  GetClienteFracionadoFiltro(
    variable: string,
    tipo: number
  ): Observable<ResponseI> {
    let direccion = this.url + 'Cliente/Filtro' + variable + ',' + tipo;
    return this.http.get<any>(direccion).pipe(
      map((data) => {
        return JSON.parse(this.objeto.decrypt(data['valor']));
      }),
      catchError((error) => {
        console.error('Error al obtener y desencriptar los datos', error);
        throw error;
      })
    );
  }
  PostCliente(elemento: ClienteI): Observable<any> {
    let Encryptado: EntidadEncriptado = {
      valor: this.objeto.encriptarAES(elemento),
    };
    let direccion = this.url + 'Cliente';
    return this.http.post<any>(direccion, Encryptado).pipe(
      map((data) => {
        return JSON.parse(this.objeto.decrypt(data['valor']));
      }),
      catchError((error) => {
        console.error('Error al obtener y desencriptar los datos', error);
        throw error;
      })
    );
  }
  PutCliente(elemento: ClienteI): Observable<any> {
    let Encryptado: EntidadEncriptado = {
      valor: this.objeto.encriptarAES(elemento),
    };
    let direccion = this.url + 'Cliente';
    return this.http.put<any>(direccion, Encryptado).pipe(
      map((data) => {
        return JSON.parse(this.objeto.decrypt(data['valor']));
      }),
      catchError((error) => {
        console.error('Error al obtener y desencriptar los datos', error);
        throw error;
      })
    );
  }
  //********************* CONECTIVIDAD *********************** */
  GetConectividadFracionado(
    codigo: number,
    rango: number
  ): Observable<ResponseI> {
    let direccion = this.url + 'Conectividad/Todos' + codigo + ',' + rango;
    return this.http.get<any>(direccion).pipe(
      map((data) => {
        return JSON.parse(this.objeto.decrypt(data['valor']));
      }),
      catchError((error) => {
        console.error('Error al obtener y desencriptar los datos', error);
        throw error;
      })
    );
  }
  GetConectividadFracionadoFiltro(
    variable: string,
    tipo: number
  ): Observable<ResponseI> {
    let direccion = this.url + 'Conectividad/Filtro' + variable + ',' + tipo;
    return this.http.get<any>(direccion).pipe(
      map((data) => {
        return JSON.parse(this.objeto.decrypt(data['valor']));
      }),
      catchError((error) => {
        console.error('Error al obtener y desencriptar los datos', error);
        throw error;
      })
    );
  }
  PostConectividad(elemento: ConectividadI): Observable<any> {
    let Encryptado: EntidadEncriptado = {
      valor: this.objeto.encriptarAES(elemento),
    };
    let direccion = this.url + 'Conectividad';
    return this.http.post<any>(direccion, Encryptado).pipe(
      map((data) => {
        return JSON.parse(this.objeto.decrypt(data['valor']));
      }),
      catchError((error) => {
        console.error('Error al obtener y desencriptar los datos', error);
        throw error;
      })
    );
  }
  PutConectividad(elemento: ConectividadI): Observable<any> {
    let Encryptado: EntidadEncriptado = {
      valor: this.objeto.encriptarAES(elemento),
    };
    let direccion = this.url + 'Conectividad';
    return this.http.put<any>(direccion, Encryptado).pipe(
      map((data) => {
        return JSON.parse(this.objeto.decrypt(data['valor']));
      }),
      catchError((error) => {
        console.error('Error al obtener y desencriptar los datos', error);
        throw error;
      })
    );
  }
  //********************* CONTACTABILIDAD *********************** */
  GetContactabilidadFracionado(
    codigo: number,
    rango: number
  ): Observable<ResponseI> {
    let direccion = this.url + 'Contactabilidad/Todos' + codigo + ',' + rango;
    return this.http.get<any>(direccion).pipe(
      map((data) => {
        return JSON.parse(this.objeto.decrypt(data['valor']));
      }),
      catchError((error) => {
        console.error('Error al obtener y desencriptar los datos', error);
        throw error;
      })
    );
  }
  GetContactabilidadFracionadoFiltro(
    variable: string,
    tipo: number
  ): Observable<ResponseI> {
    let direccion = this.url + 'Contactabilidad/Filtro' + variable + ',' + tipo;
    return this.http.get<any>(direccion).pipe(
      map((data) => {
        return JSON.parse(this.objeto.decrypt(data['valor']));
      }),
      catchError((error) => {
        console.error('Error al obtener y desencriptar los datos', error);
        throw error;
      })
    );
  }
  PostContactabilidad(elemento: ContactabilidadI): Observable<any> {
    let Encryptado: EntidadEncriptado = {
      valor: this.objeto.encriptarAES(elemento),
    };
    let direccion = this.url + 'Contactabilidad';
    return this.http.post<any>(direccion, Encryptado).pipe(
      map((data) => {
        return JSON.parse(this.objeto.decrypt(data['valor']));
      }),
      catchError((error) => {
        console.error('Error al obtener y desencriptar los datos', error);
        throw error;
      })
    );
  }
  PutContactabilidad(elemento: ContactabilidadI): Observable<any> {
    let Encryptado: EntidadEncriptado = {
      valor: this.objeto.encriptarAES(elemento),
    };
    let direccion = this.url + 'Contactabilidad';
    return this.http.put<any>(direccion, Encryptado).pipe(
      map((data) => {
        return JSON.parse(this.objeto.decrypt(data['valor']));
      }),
      catchError((error) => {
        console.error('Error al obtener y desencriptar los datos', error);
        throw error;
      })
    );
  }
  //********************* CORREOS   *********************** */
  GetCorreosFracionado(codigo: number, rango: number): Observable<ResponseI> {
    let direccion = this.url + 'Correo/Todos' + codigo + ',' + rango;
    return this.http.get<any>(direccion).pipe(
      map((data) => {
        return JSON.parse(this.objeto.decrypt(data['valor']));
      }),
      catchError((error) => {
        console.error('Error al obtener y desencriptar los datos', error);
        throw error;
      })
    );
  }
  GetCorreosFracionadoFiltro(
    variable: string,
    tipo: number
  ): Observable<ResponseI> {
    let direccion = this.url + 'Correo/Filtro' + variable + ',' + tipo;
    return this.http.get<any>(direccion).pipe(
      map((data) => {
        return JSON.parse(this.objeto.decrypt(data['valor']));
      }),
      catchError((error) => {
        console.error('Error al obtener y desencriptar los datos', error);
        throw error;
      })
    );
  }
  PostCorreos(elemento: CorreoI): Observable<any> {
    let Encryptado: EntidadEncriptado = {
      valor: this.objeto.encriptarAES(elemento),
    };
    let direccion = this.url + 'Correo';
    return this.http.post<any>(direccion, Encryptado).pipe(
      map((data) => {
        return JSON.parse(this.objeto.decrypt(data['valor']));
      }),
      catchError((error) => {
        console.error('Error al obtener y desencriptar los datos', error);
        throw error;
      })
    );
  }
  PutCorreos(elemento: CorreoI): Observable<any> {
    let Encryptado: EntidadEncriptado = {
      valor: this.objeto.encriptarAES(elemento),
    };
    let direccion = this.url + 'Correo';
    return this.http.put<any>(direccion, Encryptado).pipe(
      map((data) => {
        return JSON.parse(this.objeto.decrypt(data['valor']));
      }),
      catchError((error) => {
        console.error('Error al obtener y desencriptar los datos', error);
        throw error;
      })
    );
  }
  //********************* CUENTAS   *********************** */
  GetCuentasFracionado(codigo: number, rango: number): Observable<ResponseI> {
    let direccion = this.url + 'Cuenta/Todos' + codigo + ',' + rango;
    return this.http.get<any>(direccion).pipe(
      map((data) => {
        return JSON.parse(this.objeto.decrypt(data['valor']));
      }),
      catchError((error) => {
        console.error('Error al obtener y desencriptar los datos', error);
        throw error;
      })
    );
  }
  GetCuentasFracionadoFiltro(
    variable: string,
    tipo: number
  ): Observable<ResponseI> {
    let direccion = this.url + 'Cuenta/Filtro' + variable + ',' + tipo;
    return this.http.get<any>(direccion).pipe(
      map((data) => {
        return JSON.parse(this.objeto.decrypt(data['valor']));
      }),
      catchError((error) => {
        console.error('Error al obtener y desencriptar los datos', error);
        throw error;
      })
    );
  }
  PostCuentas(elemento: CuentaI): Observable<any> {
    let Encryptado: EntidadEncriptado = {
      valor: this.objeto.encriptarAES(elemento),
    };
    let direccion = this.url + 'Cuenta';
    return this.http.post<any>(direccion, Encryptado).pipe(
      map((data) => {
        return JSON.parse(this.objeto.decrypt(data['valor']));
      }),
      catchError((error) => {
        console.error('Error al obtener y desencriptar los datos', error);
        throw error;
      })
    );
  }
  PutCuentas(elemento: CuentaI): Observable<any> {
    let Encryptado: EntidadEncriptado = {
      valor: this.objeto.encriptarAES(elemento),
    };
    let direccion = this.url + 'Cuenta';
    return this.http.put<any>(direccion, Encryptado).pipe(
      map((data) => {
        return JSON.parse(this.objeto.decrypt(data['valor']));
      }),
      catchError((error) => {
        console.error('Error al obtener y desencriptar los datos', error);
        throw error;
      })
    );
  }
  //********************* Cxc Operacion   *********************** */
  GetCxcOperacionFracionado(
    codigo: number,
    rango: number
  ): Observable<ResponseI> {
    let direccion = this.url + 'CxcOperacion/Todos' + codigo + ',' + rango;
    return this.http.get<any>(direccion).pipe(
      map((data) => {
        return JSON.parse(this.objeto.decrypt(data['valor']));
      }),
      catchError((error) => {
        console.error('Error al obtener y desencriptar los datos', error);
        throw error;
      })
    );
  }
  GetCxcOperacionFracionadoFiltro(
    variable: string,
    tipo: number
  ): Observable<ResponseI> {
    let direccion = this.url + 'CxcOperacion/Filtro' + variable + ',' + tipo;
    return this.http.get<any>(direccion).pipe(
      map((data) => {
        return JSON.parse(this.objeto.decrypt(data['valor']));
      }),
      catchError((error) => {
        console.error('Error al obtener y desencriptar los datos', error);
        throw error;
      })
    );
  }
  PostCxcOperacion(elemento: CxcOperacionI): Observable<any> {
    let Encryptado: EntidadEncriptado = {
      valor: this.objeto.encriptarAES(elemento),
    };
    let direccion = this.url + 'CxcOperacion';
    return this.http.post<any>(direccion, Encryptado).pipe(
      map((data) => {
        return JSON.parse(this.objeto.decrypt(data['valor']));
      }),
      catchError((error) => {
        console.error('Error al obtener y desencriptar los datos', error);
        throw error;
      })
    );
  }
  PutCxcOperacion(elemento: CxcOperacionI): Observable<any> {
    let Encryptado: EntidadEncriptado = {
      valor: this.objeto.encriptarAES(elemento),
    };
    let direccion = this.url + 'CxcOperacio';
    return this.http.put<any>(direccion, Encryptado).pipe(
      map((data) => {
        return JSON.parse(this.objeto.decrypt(data['valor']));
      }),
      catchError((error) => {
        console.error('Error al obtener y desencriptar los datos', error);
        throw error;
      })
    );
  }
  //********************* DETALLE TELEFONO   *********************** */
  GetDetTelefonoFracionado(
    codigo: number,
    rango: number
  ): Observable<ResponseI> {
    let direccion = this.url + 'Detalle_Telefono/Todos' + codigo + ',' + rango;
    return this.http.get<any>(direccion).pipe(
      map((data) => {
        return JSON.parse(this.objeto.decrypt(data['valor']));
      }),
      catchError((error) => {
        console.error('Error al obtener y desencriptar los datos', error);
        throw error;
      })
    );
  }
  GetDetTelefonoFracionadoFiltro(
    variable: string,
    tipo: number
  ): Observable<ResponseI> {
    let direccion =
      this.url + 'Detalle_Telefono/Filtro' + variable + ',' + tipo;
    return this.http.get<any>(direccion).pipe(
      map((data) => {
        return JSON.parse(this.objeto.decrypt(data['valor']));
      }),
      catchError((error) => {
        console.error('Error al obtener y desencriptar los datos', error);
        throw error;
      })
    );
  }
  PostDetTelefono(elemento: DetalleTelefonoI): Observable<any> {
    let Encryptado: EntidadEncriptado = {
      valor: this.objeto.encriptarAES(elemento),
    };
    let direccion = this.url + 'Detalle_Telefono';
    return this.http.post<any>(direccion, Encryptado).pipe(
      map((data) => {
        return JSON.parse(this.objeto.decrypt(data['valor']));
      }),
      catchError((error) => {
        console.error('Error al obtener y desencriptar los datos', error);
        throw error;
      })
    );
  }
  PutDetTelefono(elemento: DetalleTelefonoI): Observable<any> {
    let Encryptado: EntidadEncriptado = {
      valor: this.objeto.encriptarAES(elemento),
    };
    let direccion = this.url + 'Detalle_Telefono';
    return this.http.put<any>(direccion, Encryptado).pipe(
      map((data) => {
        return JSON.parse(this.objeto.decrypt(data['valor']));
      }),
      catchError((error) => {
        console.error('Error al obtener y desencriptar los datos', error);
        throw error;
      })
    );
  }
  //********************* DIRECCIONES   *********************** */
  GetDireccionesFracionado(
    codigo: number,
    rango: number
  ): Observable<ResponseI> {
    let direccion = this.url + 'Direccion/Todos' + codigo + ',' + rango;
    return this.http.get<any>(direccion).pipe(
      map((data) => {
        return JSON.parse(this.objeto.decrypt(data['valor']));
      }),
      catchError((error) => {
        console.error('Error al obtener y desencriptar los datos', error);
        throw error;
      })
    );
  }
  GetDireccionesFracionadoFiltro(
    variable: string,
    tipo: number
  ): Observable<ResponseI> {
    let direccion = this.url + 'Direccion/Filtro' + variable + ',' + tipo;
    return this.http.get<any>(direccion).pipe(
      map((data) => {
        return JSON.parse(this.objeto.decrypt(data['valor']));
      }),
      catchError((error) => {
        console.error('Error al obtener y desencriptar los datos', error);
        throw error;
      })
    );
  }
  PostDirecciones(elemento: DireccionI): Observable<any> {
    let Encryptado: EntidadEncriptado = {
      valor: this.objeto.encriptarAES(elemento),
    };
    let direccion = this.url + 'Direccion';
    return this.http.post<any>(direccion, Encryptado).pipe(
      map((data) => {
        return JSON.parse(this.objeto.decrypt(data['valor']));
      }),
      catchError((error) => {
        console.error('Error al obtener y desencriptar los datos', error);
        throw error;
      })
    );
  }
  PutDirecciones(elemento: DireccionI): Observable<any> {
    let Encryptado: EntidadEncriptado = {
      valor: this.objeto.encriptarAES(elemento),
    };
    let direccion = this.url + 'Direccion';
    return this.http.put<any>(direccion, Encryptado).pipe(
      map((data) => {
        return JSON.parse(this.objeto.decrypt(data['valor']));
      }),
      catchError((error) => {
        console.error('Error al obtener y desencriptar los datos', error);
        throw error;
      })
    );
  }
  //********************* GARANTE   *********************** */
  GetGarantesFracionado(codigo: number, rango: number): Observable<ResponseI> {
    let direccion = this.url + 'Garante/Todos' + codigo + ',' + rango;
    return this.http.get<any>(direccion).pipe(
      map((data) => {
        return JSON.parse(this.objeto.decrypt(data['valor']));
      }),
      catchError((error) => {
        console.error('Error al obtener y desencriptar los datos', error);
        throw error;
      })
    );
  }
  GetGarantesFracionadoFiltro(
    variable: string,
    tipo: number
  ): Observable<ResponseI> {
    let direccion = this.url + 'Garante/Filtro' + variable + ',' + tipo;
    return this.http.get<any>(direccion).pipe(
      map((data) => {
        return JSON.parse(this.objeto.decrypt(data['valor']));
      }),
      catchError((error) => {
        console.error('Error al obtener y desencriptar los datos', error);
        throw error;
      })
    );
  }
  PostGarantes(elemento: GaranteI): Observable<any> {
    let Encryptado: EntidadEncriptado = {
      valor: this.objeto.encriptarAES(elemento),
    };
    let direccion = this.url + 'Garante';
    return this.http.post<any>(direccion, Encryptado).pipe(
      map((data) => {
        return JSON.parse(this.objeto.decrypt(data['valor']));
      }),
      catchError((error) => {
        console.error('Error al obtener y desencriptar los datos', error);
        throw error;
      })
    );
  }
  PutGarantes(elemento: GaranteI): Observable<any> {
    let Encryptado: EntidadEncriptado = {
      valor: this.objeto.encriptarAES(elemento),
    };
    let direccion = this.url + 'Garante';
    return this.http.put<any>(direccion, Encryptado).pipe(
      map((data) => {
        return JSON.parse(this.objeto.decrypt(data['valor']));
      }),
      catchError((error) => {
        console.error('Error al obtener y desencriptar los datos', error);
        throw error;
      })
    );
  }
  //********************* MENU *********************** */
  GetMenuFracionado(codigo: number, rango: number): Observable<ResponseI> {
    let direccion = this.url + 'Menu/Todos' + codigo + ',' + rango;
    return this.http.get<any>(direccion).pipe(
      map((data) => {
        return JSON.parse(this.objeto.decrypt(data['valor']));
      }),
      catchError((error) => {
        console.error('Error al obtener y desencriptar los datos', error);
        throw error;
      })
    );
  }
  GetMenuFracionadoFiltro(
    variable: string,
    tipo: number
  ): Observable<ResponseI> {
    let direccion = this.url + 'Menu/Filtro' + variable + ',' + tipo;
    return this.http.get<any>(direccion).pipe(
      map((data) => {
        return JSON.parse(this.objeto.decrypt(data['valor']));
      }),
      catchError((error) => {
        console.error('Error al obtener y desencriptar los datos', error);
        throw error;
      })
    );
  }
  PostMenu(elemento: MenuI): Observable<any> {
    let Encryptado: EntidadEncriptado = {
      valor: this.objeto.encriptarAES(elemento),
    };
    let direccion = this.url + 'Menu';
    return this.http.post<any>(direccion, Encryptado).pipe(
      map((data) => {
        return JSON.parse(this.objeto.decrypt(data['valor']));
      }),
      catchError((error) => {
        console.error('Error al obtener y desencriptar los datos', error);
        throw error;
      })
    );
  }
  PutMenu(elemento: MenuI): Observable<any> {
    let Encryptado: EntidadEncriptado = {
      valor: this.objeto.encriptarAES(elemento),
    };
    let direccion = this.url + 'Menu';
    return this.http.put<any>(direccion, Encryptado).pipe(
      map((data) => {
        return JSON.parse(this.objeto.decrypt(data['valor']));
      }),
      catchError((error) => {
        console.error('Error al obtener y desencriptar los datos', error);
        throw error;
      })
    );
  }
  //********************* NOTIFICACION *********************** */
  GetNotificacionFracionado(tipo: number): Observable<ResponseI> {
    let direccion = this.url + 'Notificaciones/Todos' + tipo;
    return this.http.get<any>(direccion).pipe(
      map((data) => {
        return JSON.parse(this.objeto.decrypt(data['valor']));
      }),
      catchError((error) => {
        console.error('Error al obtener y desencriptar los datos', error);
        throw error;
      })
    );
  }
  GetNotificacionFracionadoFiltro(
    variable: string,
    tipo: number
  ): Observable<ResponseI> {
    let direccion = this.url + 'Notificaciones/Filtro' + variable + ',' + tipo;
    return this.http.get<any>(direccion).pipe(
      map((data) => {
        return JSON.parse(this.objeto.decrypt(data['valor']));
      }),
      catchError((error) => {
        console.error('Error al obtener y desencriptar los datos', error);
        throw error;
      })
    );
  }
  PostNotificacion(elemento: NotificacionI): Observable<any> {
    let Encryptado: EntidadEncriptado = {
      valor: this.objeto.encriptarAES(elemento),
    };
    let direccion = this.url + 'Notificaciones';
    return this.http.post<any>(direccion, Encryptado).pipe(
      map((data) => {
        return JSON.parse(this.objeto.decrypt(data['valor']));
      }),
      catchError((error) => {
        console.error('Error al obtener y desencriptar los datos', error);
        throw error;
      })
    );
  }
  PutNotificacion(elemento: NotificacionI): Observable<any> {
    let Encryptado: EntidadEncriptado = {
      valor: this.objeto.encriptarAES(elemento),
    };
    let direccion = this.url + 'Notificaciones';
    return this.http.put<any>(direccion, Encryptado).pipe(
      map((data) => {
        return JSON.parse(this.objeto.decrypt(data['valor']));
      }),
      catchError((error) => {
        console.error('Error al obtener y desencriptar los datos', error);
        throw error;
      })
    );
  }
  //********************* PERMISOS *********************** */
  GetPermisosFracionado(codigo: number, rango: number): Observable<ResponseI> {
    let direccion = this.url + 'Permisos/Todos' + codigo + ',' + rango;
    return this.http.get<any>(direccion).pipe(
      map((data) => {
        return JSON.parse(this.objeto.decrypt(data['valor']));
      }),
      catchError((error) => {
        console.error('Error al obtener y desencriptar los datos', error);
        throw error;
      })
    );
  }
  GetPermisosFracionadoFiltro(
    variable: string,
    tipo: number
  ): Observable<ResponseI> {
    let direccion = this.url + 'Permisos/Filtro' + variable + ',' + tipo;
    return this.http.get<any>(direccion).pipe(
      map((data) => {
        return JSON.parse(this.objeto.decrypt(data['valor']));
      }),
      catchError((error) => {
        console.error('Error al obtener y desencriptar los datos', error);
        throw error;
      })
    );
  }
  PostPermisos(elemento: PermisosI): Observable<any> {
    let Encryptado: EntidadEncriptado = {
      valor: this.objeto.encriptarAES(elemento),
    };
    let direccion = this.url + 'Permisos';
    return this.http.post<any>(direccion, Encryptado).pipe(
      map((data) => {
        return JSON.parse(this.objeto.decrypt(data['valor']));
      }),
      catchError((error) => {
        console.error('Error al obtener y desencriptar los datos', error);
        throw error;
      })
    );
  }
  PutPermisos(elemento: PermisosI): Observable<any> {
    let Encryptado: EntidadEncriptado = {
      valor: this.objeto.encriptarAES(elemento),
    };
    let direccion = this.url + 'Permisos';
    return this.http.put<any>(direccion, Encryptado).pipe(
      map((data) => {
        return JSON.parse(this.objeto.decrypt(data['valor']));
      }),
      catchError((error) => {
        console.error('Error al obtener y desencriptar los datos', error);
        throw error;
      })
    );
  }
  //********************* ROLES *********************** */
  GetRolesFracionado(codigo: number, rango: number): Observable<ResponseI> {
    let direccion = this.url + 'Roles/Todos' + codigo + ',' + rango;
    return this.http.get<any>(direccion).pipe(
      map((data) => {
        return JSON.parse(this.objeto.decrypt(data['valor']));
      }),
      catchError((error) => {
        console.error('Error al obtener y desencriptar los datos', error);
        throw error;
      })
    );
  }
  GetRolesFracionadoFiltro(
    variable: string,
    tipo: number
  ): Observable<ResponseI> {
    let direccion = this.url + 'Roles/Filtro' + variable + ',' + tipo;
    return this.http.get<any>(direccion).pipe(
      map((data) => {
        return JSON.parse(this.objeto.decrypt(data['valor']));
      }),
      catchError((error) => {
        console.error('Error al obtener y desencriptar los datos', error);
        throw error;
      })
    );
  }
  PostRoles(elemento: RolesI): Observable<any> {
    let Encryptado: EntidadEncriptado = {
      valor: this.objeto.encriptarAES(elemento),
    };
    let direccion = this.url + 'Roles';
    return this.http.post<any>(direccion, Encryptado).pipe(
      map((data) => {
        return JSON.parse(this.objeto.decrypt(data['valor']));
      }),
      catchError((error) => {
        console.error('Error al obtener y desencriptar los datos', error);
        throw error;
      })
    );
  }
  PutRoles(elemento: RolesI): Observable<any> {
    let Encryptado: EntidadEncriptado = {
      valor: this.objeto.encriptarAES(elemento),
    };
    let direccion = this.url + 'Roles';
    return this.http.put<any>(direccion, Encryptado).pipe(
      map((data) => {
        return JSON.parse(this.objeto.decrypt(data['valor']));
      }),
      catchError((error) => {
        console.error('Error al obtener y desencriptar los datos', error);
        throw error;
      })
    );
  }
  //********************* TELEFONOS *********************** */
  GetTelefonosFracionado(codigo: number, rango: number): Observable<ResponseI> {
    let direccion = this.url + 'Telefono/Todos' + codigo + ',' + rango;
    return this.http.get<any>(direccion).pipe(
      map((data) => {
        return JSON.parse(this.objeto.decrypt(data['valor']));
      }),
      catchError((error) => {
        console.error('Error al obtener y desencriptar los datos', error);
        throw error;
      })
    );
  }
  GetTelefonosFracionadoFiltro(
    variable: string,
    tipo: number
  ): Observable<ResponseI> {
    let direccion = this.url + 'Telefono/Filtro' + variable + ',' + tipo;
    return this.http.get<any>(direccion).pipe(
      map((data) => {
        return JSON.parse(this.objeto.decrypt(data['valor']));
      }),
      catchError((error) => {
        console.error('Error al obtener y desencriptar los datos', error);
        throw error;
      })
    );
  }
  PostTelefonos(elemento: TelefonoI): Observable<any> {
    let Encryptado: EntidadEncriptado = {
      valor: this.objeto.encriptarAES(elemento),
    };
    let direccion = this.url + 'Telefono';
    return this.http.post<any>(direccion, Encryptado).pipe(
      map((data) => {
        return JSON.parse(this.objeto.decrypt(data['valor']));
      }),
      catchError((error) => {
        console.error('Error al obtener y desencriptar los datos', error);
        throw error;
      })
    );
  }
  PutTelefonos(elemento: TelefonoI): Observable<any> {
    let Encryptado: EntidadEncriptado = {
      valor: this.objeto.encriptarAES(elemento),
    };
    let direccion = this.url + 'Telefono';
    return this.http.put<any>(direccion, Encryptado).pipe(
      map((data) => {
        return JSON.parse(this.objeto.decrypt(data['valor']));
      }),
      catchError((error) => {
        console.error('Error al obtener y desencriptar los datos', error);
        throw error;
      })
    );
  }
  //********************* TRABAJO *********************** */
  GetTrabajosFracionado(codigo: number, rango: number): Observable<ResponseI> {
    let direccion = this.url + 'Trabajo/Todos' + codigo + ',' + rango;
    return this.http.get<any>(direccion).pipe(
      map((data) => {
        return JSON.parse(this.objeto.decrypt(data['valor']));
      }),
      catchError((error) => {
        console.error('Error al obtener y desencriptar los datos', error);
        throw error;
      })
    );
  }
  GetTrabajosFracionadoFiltro(
    variable: string,
    tipo: number
  ): Observable<ResponseI> {
    let direccion = this.url + 'Trabajo/Filtro' + variable + ',' + tipo;
    return this.http.get<any>(direccion).pipe(
      map((data) => {
        return JSON.parse(this.objeto.decrypt(data['valor']));
      }),
      catchError((error) => {
        console.error('Error al obtener y desencriptar los datos', error);
        throw error;
      })
    );
  }
  PostTrabajos(elemento: TrabajoI): Observable<any> {
    let Encryptado: EntidadEncriptado = {
      valor: this.objeto.encriptarAES(elemento),
    };
    let direccion = this.url + 'Trabajo';
    return this.http.post<any>(direccion, Encryptado).pipe(
      map((data) => {
        return JSON.parse(this.objeto.decrypt(data['valor']));
      }),
      catchError((error) => {
        console.error('Error al obtener y desencriptar los datos', error);
        throw error;
      })
    );
  }
  PutTrabajos(elemento: TrabajoI): Observable<any> {
    let Encryptado: EntidadEncriptado = {
      valor: this.objeto.encriptarAES(elemento),
    };
    let direccion = this.url + 'Trabajo';
    return this.http.put<any>(direccion, Encryptado).pipe(
      map((data) => {
        return JSON.parse(this.objeto.decrypt(data['valor']));
      }),
      catchError((error) => {
        console.error('Error al obtener y desencriptar los datos', error);
        throw error;
      })
    );
  }
  //********************* USUARIOS *********************** */
  GetUsuariosFracionado(codigo: number, rango: number): Observable<ResponseI> {
    let direccion = this.url + 'Usuarios/Todos' + codigo + ',' + rango;
    return this.http.get<any>(direccion).pipe(
      map((data) => {
        return JSON.parse(this.objeto.decrypt(data['valor']));
      }),
      catchError((error) => {
        console.error('Error al obtener y desencriptar los datos', error);
        throw error;
      })
    );
  }
  GetUsuariosFracionadoFiltro(
    variable: string,
    tipo: number
  ): Observable<ResponseI> {
    let direccion = this.url + 'Usuarios/Filtro' + variable + ',' + tipo;
    return this.http.get<any>(direccion).pipe(
      map((data) => {
        return JSON.parse(this.objeto.decrypt(data['valor']));
      }),
      catchError((error) => {
        console.error('Error al obtener y desencriptar los datos', error);
        throw error;
      })
    );
  }
  PostUsuarios(elemento: UsuariosI): Observable<any> {
    let Encryptado: EntidadEncriptado = {
      valor: this.objeto.encriptarAES(elemento),
    };
    let direccion = this.url + 'Usuarios';
    return this.http.post<any>(direccion, Encryptado).pipe(
      map((data) => {
        return JSON.parse(this.objeto.decrypt(data['valor']));
      }),
      catchError((error) => {
        console.error('Error al obtener y desencriptar los datos', error);
        throw error;
      })
    );
  }
  PutUsuarios(elemento: UsuariosI): Observable<any> {
    let Encryptado: EntidadEncriptado = {
      valor: this.objeto.encriptarAES(elemento),
    };
    let direccion = this.url + 'Usuarios';
    return this.http.put<any>(direccion, Encryptado).pipe(
      map((data) => {
        return JSON.parse(this.objeto.decrypt(data['valor']));
      }),
      catchError((error) => {
        console.error('Error al obtener y desencriptar los datos', error);
        throw error;
      })
    );
  }
  //********************* GESTORES *********************** */
  GetGestoresFracionado(codigo: number, rango: number): Observable<ResponseI> {
    let direccion = this.url + 'Gestor/Todos' + codigo + ',' + rango;
    return this.http.get<any>(direccion).pipe(
      map((data) => {
        return JSON.parse(this.objeto.decrypt(data['valor']));
      }),
      catchError((error) => {
        console.error('Error al obtener y desencriptar los datos', error);
        throw error;
      })
    );
  }
  GetGestoresFracionadoFiltro(
    variable: string,
    tipo: number
  ): Observable<ResponseI> {
    let direccion = this.url + 'Gestor/Filtro' + variable + ',' + tipo;
    return this.http.get<any>(direccion).pipe(
      map((data) => {
        return JSON.parse(this.objeto.decrypt(data['valor']));
      }),
      catchError((error) => {
        console.error('Error al obtener y desencriptar los datos', error);
        throw error;
      })
    );
  }
  PostGestores(elemento: GestorI): Observable<any> {
    let Encryptado: EntidadEncriptado = {
      valor: this.objeto.encriptarAES(elemento),
    };
    let direccion = this.url + 'Gestor';
    return this.http.post<any>(direccion, Encryptado).pipe(
      map((data) => {
        return JSON.parse(this.objeto.decrypt(data['valor']));
      }),
      catchError((error) => {
        console.error('Error al obtener y desencriptar los datos', error);
        throw error;
      })
    );
  }
  PutGestores(elemento: GestorI): Observable<any> {
    let Encryptado: EntidadEncriptado = {
      valor: this.objeto.encriptarAES(elemento),
    };
    let direccion = this.url + 'Gestor';
    return this.http.put<any>(direccion, Encryptado).pipe(
      map((data) => {
        return JSON.parse(this.objeto.decrypt(data['valor']));
      }),
      catchError((error) => {
        console.error('Error al obtener y desencriptar los datos', error);
        throw error;
      })
    );
  }
  //********************* GESTION *********************** */
  GetGestionFracionado(codigo: number, rango: number): Observable<ResponseI> {
    let direccion = this.url + 'Gestion/Todos' + codigo + ',' + rango;
    return this.http.get<any>(direccion).pipe(
      map((data) => {
        return JSON.parse(this.objeto.decrypt(data['valor']));
      }),
      catchError((error) => {
        console.error('Error al obtener y desencriptar los datos', error);
        throw error;
      })
    );
  }
  GetGestionFracionadoFiltro(filtro: FiltroGestion): Observable<ResponseI> {
    let direccion = this.url + 'Gestion/Filtro';
    const params = new HttpParams({ fromObject: filtro });
    return this.http.get<any>(direccion, { params }).pipe(
      map((data) => {
        return JSON.parse(this.objeto.decrypt(data['valor']));
      }),
      catchError((error) => {
        console.error('Error al obtener y desencriptar los datos', error);
        throw error;
      })
    );
  }
  GetGestionFracionadoSecondFiltro(filtro: FiltroGestion): Observable<ResponseI> {
    let direccion = this.url + 'Gestion/FiltroSecond';
    const params = new HttpParams({ fromObject: filtro });
    return this.http.get<any>(direccion, { params }).pipe(
      map((data) => {
        return JSON.parse(this.objeto.decrypt(data['valor']));
      }),
      catchError((error) => {
        console.error('Error al obtener y desencriptar los datos', error);
        throw error;
      })
    );
  }
  GetGestionFracionadoThirdFiltro(filtro: FiltroGestion): Observable<ResponseI> {
    let direccion = this.url + 'Gestion/FiltroThird';
    const params = new HttpParams({ fromObject: filtro });
    return this.http.get<any>(direccion, { params }).pipe(
      map((data) => {
        return JSON.parse(this.objeto.decrypt(data['valor']));
      }),
      catchError((error) => {
        console.error('Error al obtener y desencriptar los datos', error);
        throw error;
      })
    );
  }
  GetGestionFracionado3(codigo: number, rango: number): Observable<ResponseI> {
    let direccion = this.url + 'Gestion/TodasUltimasGestiones' + codigo + ',' + rango;
    return this.http.get<any>(direccion).pipe(
      map((data) => {
        return JSON.parse(this.objeto.decrypt(data['valor']));
      }),
      catchError((error) => {
        console.error('Error al obtener y desencriptar los datos', error);
        throw error;
      })
    );
  }
  PostGestion(elemento: GestionI): Observable<any> {
    let Encryptado: EntidadEncriptado = {
      valor: this.objeto.encriptarAES(elemento),
    };
    let direccion = this.url + 'Gestion';
    return this.http.post<any>(direccion, Encryptado).pipe(
      map((data) => {
        return JSON.parse(this.objeto.decrypt(data['valor']));
      }),
      catchError((error) => {
        console.error('Error al obtener y desencriptar los datos', error);
        throw error;
      })
    );
  }
  PutGestion(elemento: GestionI): Observable<any> {
    let Encryptado: EntidadEncriptado = {
      valor: this.objeto.encriptarAES(elemento),
    };
    let direccion = this.url + 'Gestion';
    return this.http.put<any>(direccion, Encryptado).pipe(
      map((data) => {
        return JSON.parse(this.objeto.decrypt(data['valor']));
      }),
      catchError((error) => {
        console.error('Error al obtener y desencriptar los datos', error);
        throw error;
      })
    );
  }
  //********************* GESTIONAR *********************** */
  GetGestionarFracionado(filtro: GestionCG): Observable<ResponseI> {
    let direccion = this.url + 'Gestionar/Todos';
    const params = new HttpParams({ fromObject: filtro });
    return this.http.get<any>(direccion, { params }).pipe(
      map((data) => {
        return JSON.parse(this.objeto.decrypt(data['valor']));
      }),
      catchError((error) => {
        console.error('Error al obtener y desencriptar los datos', error);
        throw error;
      })
    );
  }
  GetGestionarFracionadoFiltro(filtro: GestionarPropio): Observable<ResponseI> {
    let direccion = this.url + 'Gestionar/Filtro';
    const params = new HttpParams({ fromObject: filtro });
    return this.http.get<any>(direccion, { params }).pipe(
      map((data) => {
        return JSON.parse(this.objeto.decrypt(data['valor']));
      }),
      catchError((error) => {
        console.error('Error al obtener y desencriptar los datos', error);
        throw error;
      })
    );
  }
  PostGestionar(elemento: GestionI): Observable<any> {
    let Encryptado: EntidadEncriptado = {
      valor: this.objeto.encriptarAES(elemento),
    };
    let direccion = this.url + 'Gestion';
    return this.http.post<any>(direccion, Encryptado).pipe(
      map((data) => {
        return JSON.parse(this.objeto.decrypt(data['valor']));
      }),
      catchError((error) => {
        console.error('Error al obtener y desencriptar los datos', error);
        throw error;
      })
    );
  }
  PutGestionar(elemento: GestionI): Observable<any> {
    let Encryptado: EntidadEncriptado = {
      valor: this.objeto.encriptarAES(elemento),
    };
    let direccion = this.url + 'Gestion';
    return this.http.put<any>(direccion, Encryptado).pipe(
      map((data) => {
        return JSON.parse(this.objeto.decrypt(data['valor']));
      }),
      catchError((error) => {
        console.error('Error al obtener y desencriptar los datos', error);
        throw error;
      })
    );
  }
  //********************* TIPO CARTERA *********************** */
  GetTipoCarteraFracionado(
    codigo: number,
    rango: number
  ): Observable<ResponseI> {
    let direccion = this.url + 'Tipo_Cartera/Todos' + codigo + ',' + rango;
    return this.http.get<any>(direccion).pipe(
      map((data) => {
        return JSON.parse(this.objeto.decrypt(data['valor']));
      }),
      catchError((error) => {
        console.error('Error al obtener y desencriptar los datos', error);
        throw error;
      })
    );
  }
  GetT_C_FracionadoFiltro(
    variable: string,
    tipo: number
  ): Observable<ResponseI> {
    let direccion = this.url + 'Tipo_Cartera/Filtro' + variable + ',' + tipo;
    return this.http.get<any>(direccion).pipe(
      map((data) => {
        return JSON.parse(this.objeto.decrypt(data['valor']));
      }),
      catchError((error) => {
        console.error('Error al obtener y desencriptar los datos', error);
        throw error;
      })
    );
  }
  PostTipoCartera(elemento: Tipo_CarteraI): Observable<any> {
    let Encryptado: EntidadEncriptado = {
      valor: this.objeto.encriptarAES(elemento),
    };
    let direccion = this.url + 'Tipo_Cartera';
    return this.http.post<any>(direccion, Encryptado).pipe(
      map((data) => {
        return JSON.parse(this.objeto.decrypt(data['valor']));
      }),
      catchError((error) => {
        console.error('Error al obtener y desencriptar los datos', error);
        throw error;
      })
    );
  }
  PutTipoCartera(elemento: Tipo_CarteraI): Observable<any> {
    let Encryptado: EntidadEncriptado = {
      valor: this.objeto.encriptarAES(elemento),
    };
    let direccion = this.url + 'Tipo_Cartera';
    return this.http.put<any>(direccion, Encryptado).pipe(
      map((data) => {
        return JSON.parse(this.objeto.decrypt(data['valor']));
      }),
      catchError((error) => {
        console.error('Error al obtener y desencriptar los datos', error);
        throw error;
      })
    );
  }

  //********************* TIPO CORREOS *********************** */
  GetTipoCorreoFracionado(
    codigo: number,
    rango: number
  ): Observable<ResponseI> {
    let direccion = this.url + 'Tipo_Correo/Todos' + codigo + ',' + rango;
    return this.http.get<any>(direccion).pipe(
      map((data) => {
        return JSON.parse(this.objeto.decrypt(data['valor']));
      }),
      catchError((error) => {
        console.error('Error al obtener y desencriptar los datos', error);
        throw error;
      })
    );
  }
  GetTipoCorreoFracionadoFiltro(
    variable: string,
    tipo: number
  ): Observable<ResponseI> {
    let direccion = this.url + 'Tipo_Correo/Filtro' + variable + ',' + tipo;
    return this.http.get<any>(direccion).pipe(
      map((data) => {
        return JSON.parse(this.objeto.decrypt(data['valor']));
      }),
      catchError((error) => {
        console.error('Error al obtener y desencriptar los datos', error);
        throw error;
      })
    );
  }
  PostTipoCorreo(elemento: Tipo_CorreoI): Observable<any> {
    let Encryptado: EntidadEncriptado = {
      valor: this.objeto.encriptarAES(elemento),
    };
    let direccion = this.url + 'Tipo_Correo';
    return this.http.post<any>(direccion, Encryptado).pipe(
      map((data) => {
        return JSON.parse(this.objeto.decrypt(data['valor']));
      }),
      catchError((error) => {
        console.error('Error al obtener y desencriptar los datos', error);
        throw error;
      })
    );
  }
  PutTipoCorreo(elemento: Tipo_CorreoI): Observable<any> {
    let Encryptado: EntidadEncriptado = {
      valor: this.objeto.encriptarAES(elemento),
    };
    let direccion = this.url + 'Tipo_Correo';
    return this.http.put<any>(direccion, Encryptado).pipe(
      map((data) => {
        return JSON.parse(this.objeto.decrypt(data['valor']));
      }),
      catchError((error) => {
        console.error('Error al obtener y desencriptar los datos', error);
        throw error;
      })
    );
  }
  //********************* TIPO DIRECCIONES *********************** */
  GetTipoDireccionFracionado(
    codigo: number,
    rango: number
  ): Observable<ResponseI> {
    let direccion = this.url + 'Tipo_Direccion/Todos' + codigo + ',' + rango;
    return this.http.get<any>(direccion).pipe(
      map((data) => {
        return JSON.parse(this.objeto.decrypt(data['valor']));
      }),
      catchError((error) => {
        console.error('Error al obtener y desencriptar los datos', error);
        throw error;
      })
    );
  }
  GetTipoDireccionFracionadoFiltro(
    variable: string,
    tipo: number
  ): Observable<ResponseI> {
    let direccion = this.url + 'Tipo_Direccion/Filtro' + variable + ',' + tipo;
    return this.http.get<any>(direccion).pipe(
      map((data) => {
        return JSON.parse(this.objeto.decrypt(data['valor']));
      }),
      catchError((error) => {
        console.error('Error al obtener y desencriptar los datos', error);
        throw error;
      })
    );
  }
  PostTipoDireccion(elemento: Tipo_DireccionI): Observable<any> {
    let Encryptado: EntidadEncriptado = {
      valor: this.objeto.encriptarAES(elemento),
    };
    let direccion = this.url + 'Tipo_Direccion';
    return this.http.post<any>(direccion, Encryptado).pipe(
      map((data) => {
        return JSON.parse(this.objeto.decrypt(data['valor']));
      }),
      catchError((error) => {
        console.error('Error al obtener y desencriptar los datos', error);
        throw error;
      })
    );
  }
  PutTipoDireccion(elemento: Tipo_DireccionI): Observable<any> {
    let Encryptado: EntidadEncriptado = {
      valor: this.objeto.encriptarAES(elemento),
    };
    let direccion = this.url + 'Tipo_Direccion';
    return this.http.put<any>(direccion, Encryptado).pipe(
      map((data) => {
        return JSON.parse(this.objeto.decrypt(data['valor']));
      }),
      catchError((error) => {
        console.error('Error al obtener y desencriptar los datos', error);
        throw error;
      })
    );
  }
  //********************* TIPO DOCUMENTOS *********************** */
  GetTipoDocAdicionalFracionado(
    codigo: number,
    rango: number
  ): Observable<ResponseI> {
    let direccion =
      this.url + 'Tipo_Doc_Adicional/Todos' + codigo + ',' + rango;
    return this.http.get<any>(direccion).pipe(
      map((data) => {
        return JSON.parse(this.objeto.decrypt(data['valor']));
      }),
      catchError((error) => {
        console.error('Error al obtener y desencriptar los datos', error);
        throw error;
      })
    );
  }
  GetTipoDocAdicionalFracionadoFiltro(
    variable: string,
    tipo: number
  ): Observable<ResponseI> {
    let direccion =
      this.url + 'Tipo_Doc_Adicional/Filtro' + variable + ',' + tipo;
    return this.http.get<any>(direccion).pipe(
      map((data) => {
        return JSON.parse(this.objeto.decrypt(data['valor']));
      }),
      catchError((error) => {
        console.error('Error al obtener y desencriptar los datos', error);
        throw error;
      })
    );
  }
  PostTipoDocAdicional(elemento: Tipo_Doc_AdicionalI): Observable<any> {
    let Encryptado: EntidadEncriptado = {
      valor: this.objeto.encriptarAES(elemento),
    };
    let direccion = this.url + 'Tipo_Doc_Adicional';
    return this.http.post<any>(direccion, Encryptado).pipe(
      map((data) => {
        return JSON.parse(this.objeto.decrypt(data['valor']));
      }),
      catchError((error) => {
        console.error('Error al obtener y desencriptar los datos', error);
        throw error;
      })
    );
  }
  PutTipoDocAdicional(elemento: Tipo_Doc_AdicionalI): Observable<any> {
    let Encryptado: EntidadEncriptado = {
      valor: this.objeto.encriptarAES(elemento),
    };
    let direccion = this.url + 'Tipo_Doc_Adicional';
    return this.http.put<any>(direccion, Encryptado).pipe(
      map((data) => {
        return JSON.parse(this.objeto.decrypt(data['valor']));
      }),
      catchError((error) => {
        console.error('Error al obtener y desencriptar los datos', error);
        throw error;
      })
    );
  }
  //********************* TIPO GESTION *********************** */
  GetTipoGestionFracionado(
    codigo: number,
    rango: number
  ): Observable<ResponseI> {
    let direccion = this.url + 'Tipo_Gestion/Todos' + codigo + ',' + rango;
    return this.http.get<any>(direccion).pipe(
      map((data) => {
        return JSON.parse(this.objeto.decrypt(data['valor']));
      }),
      catchError((error) => {
        console.error('Error al obtener y desencriptar los datos', error);
        throw error;
      })
    );
  }
  GetTipoGestionFracionadoFiltro(
    variable: string,
    tipo: number
  ): Observable<ResponseI> {
    let direccion = this.url + 'Tipo_Gestion/Filtro' + variable + ',' + tipo;
    return this.http.get<any>(direccion).pipe(
      map((data) => {
        return JSON.parse(this.objeto.decrypt(data['valor']));
      }),
      catchError((error) => {
        console.error('Error al obtener y desencriptar los datos', error);
        throw error;
      })
    );
  }
  PostTipoGestion(elemento: Tipo_GestionI): Observable<any> {
    let Encryptado: EntidadEncriptado = {
      valor: this.objeto.encriptarAES(elemento),
    };
    let direccion = this.url + 'Tipo_Gestion';
    return this.http.post<any>(direccion, Encryptado).pipe(
      map((data) => {
        return JSON.parse(this.objeto.decrypt(data['valor']));
      }),
      catchError((error) => {
        console.error('Error al obtener y desencriptar los datos', error);
        throw error;
      })
    );
  }
  PutTipoGestion(elemento: Tipo_GestionI): Observable<any> {
    let Encryptado: EntidadEncriptado = {
      valor: this.objeto.encriptarAES(elemento),
    };
    let direccion = this.url + 'Tipo_Gestion';
    return this.http.put<any>(direccion, Encryptado).pipe(
      map((data) => {
        return JSON.parse(this.objeto.decrypt(data['valor']));
      }),
      catchError((error) => {
        console.error('Error al obtener y desencriptar los datos', error);
        throw error;
      })
    );
  }
  //********************* TIPO TELEFONO *********************** */
  GetTipoTelefonoFracionado(
    codigo: number,
    rango: number
  ): Observable<ResponseI> {
    let direccion = this.url + 'Tipo_Telefono/Todos' + codigo + ',' + rango;
    return this.http.get<any>(direccion).pipe(
      map((data) => {
        return JSON.parse(this.objeto.decrypt(data['valor']));
      }),
      catchError((error) => {
        console.error('Error al obtener y desencriptar los datos', error);
        throw error;
      })
    );
  }
  GetTipoTelefonoFracionadoFiltro(
    variable: string,
    tipo: number
  ): Observable<ResponseI> {
    let direccion = this.url + 'Tipo_Telefono/Filtro' + variable + ',' + tipo;
    return this.http.get<any>(direccion).pipe(
      map((data) => {
        return JSON.parse(this.objeto.decrypt(data['valor']));
      }),
      catchError((error) => {
        console.error('Error al obtener y desencriptar los datos', error);
        throw error;
      })
    );
  }
  PostTipoTelefono(elemento: Tipo_TelefonoI): Observable<any> {
    let Encryptado: EntidadEncriptado = {
      valor: this.objeto.encriptarAES(elemento),
    };
    let direccion = this.url + 'Tipo_Telefono';
    return this.http.post<any>(direccion, Encryptado).pipe(
      map((data) => {
        return JSON.parse(this.objeto.decrypt(data['valor']));
      }),
      catchError((error) => {
        console.error('Error al obtener y desencriptar los datos', error);
        throw error;
      })
    );
  }
  PutTipoTelefono(elemento: Tipo_TelefonoI): Observable<any> {
    let Encryptado: EntidadEncriptado = {
      valor: this.objeto.encriptarAES(elemento),
    };
    let direccion = this.url + 'Tipo_Telefono';
    return this.http.put<any>(direccion, Encryptado).pipe(
      map((data) => {
        return JSON.parse(this.objeto.decrypt(data['valor']));
      }),
      catchError((error) => {
        console.error('Error al obtener y desencriptar los datos', error);
        throw error;
      })
    );
  }
  //********************* TIPO TRABAJO *********************** */
  GetTipoTrabajoFracionado(
    codigo: number,
    rango: number
  ): Observable<ResponseI> {
    let direccion = this.url + 'Tipo_Trabajo/Todos' + codigo + ',' + rango;
    return this.http.get<any>(direccion).pipe(
      map((data) => {
        return JSON.parse(this.objeto.decrypt(data['valor']));
      }),
      catchError((error) => {
        console.error('Error al obtener y desencriptar los datos', error);
        throw error;
      })
    );
  }
  GetTipoTrabajoFracionadoFiltro(
    variable: string,
    tipo: number
  ): Observable<ResponseI> {
    let direccion = this.url + 'Tipo_Trabajo/Filtro' + variable + ',' + tipo;
    return this.http.get<any>(direccion).pipe(
      map((data) => {
        return JSON.parse(this.objeto.decrypt(data['valor']));
      }),
      catchError((error) => {
        console.error('Error al obtener y desencriptar los datos', error);
        throw error;
      })
    );
  }
  PostTipoTrabajo(elemento: Tipo_TrabajoI): Observable<any> {
    let Encryptado: EntidadEncriptado = {
      valor: this.objeto.encriptarAES(elemento),
    };
    let direccion = this.url + 'Tipo_Trabajo';
    return this.http.post<any>(direccion, Encryptado).pipe(
      map((data) => {
        return JSON.parse(this.objeto.decrypt(data['valor']));
      }),
      catchError((error) => {
        console.error('Error al obtener y desencriptar los datos', error);
        throw error;
      })
    );
  }
  PutTipoTrabajo(elemento: Tipo_TrabajoI): Observable<any> {
    let Encryptado: EntidadEncriptado = {
      valor: this.objeto.encriptarAES(elemento),
    };
    let direccion = this.url + 'Tipo_Trabajo';
    return this.http.put<any>(direccion, Encryptado).pipe(
      map((data) => {
        return JSON.parse(this.objeto.decrypt(data['valor']));
      }),
      catchError((error) => {
        console.error('Error al obtener y desencriptar los datos', error);
        throw error;
      })
    );
  }
  //********************* PAGOS *********************** */
  GetPagosFracionado(codigo: number, rango: number): Observable<ResponseI> {
    let direccion = this.url + 'Pagos/Todos' + codigo + ',' + rango;
    return this.http.get<any>(direccion).pipe(
      map((data) => {
        return JSON.parse(this.objeto.decrypt(data['valor']));
      }),
      catchError((error) => {
        console.error('Error al obtener y desencriptar los datos', error);
        throw error;
      })
    );
  }
  GetPagosFracionadoFiltro(filtro: FiltroPagos): Observable<ResponseI> {
    let direccion = this.url + 'Pagos/Filtro';
    const params = new HttpParams({ fromObject: filtro });
    return this.http.get<any>(direccion, { params }).pipe(
      map((data) => {
        return JSON.parse(this.objeto.decrypt(data['valor']));
      }),
      catchError((error) => {
        console.error('Error al obtener y desencriptar los datos', error);
        throw error;
      })
    );
  }
  PostPagos(elemento: PagosI): Observable<any> {
    let Encryptado: EntidadEncriptado = {
      valor: this.objeto.encriptarAES(elemento),
    };
    let direccion = this.url + 'Pagos';
    return this.http.post<any>(direccion, Encryptado).pipe(
      map((data) => {
        return JSON.parse(this.objeto.decrypt(data['valor']));
      }),
      catchError((error) => {
        console.error('Error al obtener y desencriptar los datos', error);
        throw error;
      })
    );
  }
  PutPagos(elemento: PagosI): Observable<any> {
    let Encryptado: EntidadEncriptado = {
      valor: this.objeto.encriptarAES(elemento),
    };
    let direccion = this.url + 'Pagos';
    return this.http.put<any>(direccion, Encryptado).pipe(
      map((data) => {
        return JSON.parse(this.objeto.decrypt(data['valor']));
      }),
      catchError((error) => {
        console.error('Error al obtener y desencriptar los datos', error);
        throw error;
      })
    );
  }
 
  //********************* SUBIR UNA IMAGEN AL BACK_END *********************** */
  PotsSubirImagen(data: any): Observable<any> {
    let direccion = this.url + 'SubirImagen/CargarImg';
    const formData = new FormData();
    if (data instanceof File) {
      formData.append('archivo', data);
    }
    formData.append('url', this.url.substring(0, this.url.length - 4));
    return this.http.post<any>(direccion, formData).pipe(
      map((data) => {
        return JSON.parse(this.objeto.decrypt(data['valor']));
      }),
      catchError((error) => {
        console.error('Error al obtener y desencriptar los datos', error);
        throw error;
      })
    );
  }
  //********************* TIPO     public class TipoGestion_Conectividad_Contactavilidad *********************** */
  GetTG_Conec_Contac(tg: number, conect: number): Observable<ResponseI> {
    let direccion = this.url + 'Gestionar/TG_Conect_Contac' + tg + ',' + conect;
    return this.http.get<any>(direccion).pipe(
      map((data) => {
        return JSON.parse(this.objeto.decrypt(data['valor']));
      }),
      catchError((error) => {
        console.error('Error al obtener y desencriptar los datos', error);
        throw error;
      })
    );
  }
  //********************* TIPO Buscar Clientes General *********************** */
  GetBuscarClientesGeneral(tp: number, val: string): Observable<ResponseI> {
    let direccion =
      this.url + 'Gestionar/BuscarClientesGeneral' + tp + ',' + val;
    return this.http.get<any>(direccion).pipe(
      map((data) => {
        return JSON.parse(this.objeto.decrypt(data['valor']));
      }),
      catchError((error) => {
        console.error('Error al obtener y desencriptar los datos', error);
        throw error;
      })
    );
  }

  PostIniciarSesionServiData(loginData: LoginI): Observable<ResponseI> {
    let Encryptado: EntidadEncriptado = {
      valor: this.objeto.encriptarAES(loginData),
    };

    let direccion = 'https://cobrosystemapi.cobrosystem.com/api/Login';

    return this.http.post<any>(direccion, Encryptado).pipe(
      map((data) => {
        return JSON.parse(this.objeto.decrypt(data['valor']));
      }),
      catchError((error) => {
        console.error('Error al obtener y desencriptar los datos', error);
        // this.alerta.PeticionModificada();
        throw error;
      })
    );
  }

  GetFamiliares(cedula: string, par: string): Observable<ResponseI> {
    const direccion = `https://cobrosystemapi.cobrosystem.com/api/Personas/Familiares${cedula},${par}`;
    return this.http.get<any>(direccion).pipe(
      map((data) => {
        return JSON.parse(this.objeto.decrypt(data['valor']));
      }),
      catchError((error) => {
        console.error('Error al obtener y desencriptar los datos', error);
        throw error;
      })
    );
  }
  /************************************RECARGOS***************************************** */
  GetRecargasFracionado(
    codigo: number,
    rango: number
  ): Observable<ResponseI> {
    let direccion = this.url + 'Recargo/Todos' + codigo + ',' + rango;
    return this.http.get<any>(direccion).pipe(
      map((data) => {
        return JSON.parse(this.objeto.decrypt(data['valor']));
      }),
      catchError((error) => {
        console.error('Error al obtener y desencriptar los datos', error);
        throw error;
      })
    );
  }
  GetRecargasFracionadoFiltro(
    variable: string,
    tipo: number
  ): Observable<ResponseI> {
    let direccion = this.url + 'Recargo/Filtro' + variable + ',' + tipo;
    return this.http.get<any>(direccion).pipe(
      map((data) => {
        return JSON.parse(this.objeto.decrypt(data['valor']));
      }),
      catchError((error) => {
        console.error('Error al obtener y desencriptar los datos', error);
        throw error;
      })
    );
  }
  PostRecarga(elemento: RecargoI): Observable<any> {
    let Encryptado: EntidadEncriptado = {
      valor: this.objeto.encriptarAES(elemento),
    };
    let direccion = this.url + 'Recargo';
    return this.http.post<any>(direccion, Encryptado).pipe(
      map((data) => {
        return JSON.parse(this.objeto.decrypt(data['valor']));
      }),
      catchError((error) => {
        console.error('Error al obtener y desencriptar los datos', error);
        throw error;
      })
    );
  }
  PutRecarga(elemento:RecargoI): Observable<any> {
    let Encryptado: EntidadEncriptado = {
      valor: this.objeto.encriptarAES(elemento),
    };
    let direccion = this.url + 'Recargo';
    return this.http.put<any>(direccion, Encryptado).pipe(
      map((data) => {
        return JSON.parse(this.objeto.decrypt(data['valor']));
      }),
      catchError((error) => {
        console.error('Error al obtener y desencriptar los datos', error);
        throw error;
      })
    );
  }
//********************* TIPO Recargos *********************** */
GetTipoRecargoFracionado(
  codigo: number,
  rango: number
): Observable<ResponseI> {
  let direccion = this.url + 'Tipo_Recargo/Todos' + codigo + ',' + rango;
  return this.http.get<any>(direccion).pipe(
    map((data) => {
      return JSON.parse(this.objeto.decrypt(data['valor']));
    }),
    catchError((error) => {
      console.error('Error al obtener y desencriptar los datos', error);
      throw error;
    })
  );
}
GetTipoRecargoFracionadoFiltro(
  variable: string,
  tipo: number
): Observable<ResponseI> {
  let direccion = this.url + 'Tipo_Recargo/Filtro' + variable + ',' + tipo;
  return this.http.get<any>(direccion).pipe(
    map((data) => {
      return JSON.parse(this.objeto.decrypt(data['valor']));
    }),
    catchError((error) => {
      console.error('Error al obtener y desencriptar los datos', error);
      throw error;
    })
  );
}
PostTipoRecargo(elemento: Tipo_RecargoI): Observable<any> {
  let Encryptado: EntidadEncriptado = {
    valor: this.objeto.encriptarAES(elemento),
  };
  let direccion = this.url + 'Tipo_Recargo';
  return this.http.post<any>(direccion, Encryptado).pipe(
    map((data) => {
      return JSON.parse(this.objeto.decrypt(data['valor']));
    }),
    catchError((error) => {
      console.error('Error al obtener y desencriptar los datos', error);
      throw error;
    })
  );
}
PutTipoRecargo(elemento: Tipo_RecargoI): Observable<any> {
  let Encryptado: EntidadEncriptado = {
    valor: this.objeto.encriptarAES(elemento),
  };
  let direccion = this.url + 'Tipo_Recargo';
  return this.http.put<any>(direccion, Encryptado).pipe(
    map((data) => {
      return JSON.parse(this.objeto.decrypt(data['valor']));
    }),
    catchError((error) => {
      console.error('Error al obtener y desencriptar los datos', error);
      throw error;
    })
  );
}
  // GetTipoTrabajoFracionadoFiltro(variable: string,tipo: number): Observable<ResponseI> {
  //   let direccion = this.url + 'Tipo_Trabajo/Filtro'+variable+','+tipo;
  //   return this.http.get<any>(direccion).pipe(
  //     map((data) => {
  //       return JSON.parse(this.objeto.decrypt(data['valor']));
  //     }),
  //     catchError((error) => {
  //       console.error('Error al obtener y desencriptar los datos', error);
  //       throw error;
  //     })
  //   );
  // }
  // PostTipoTrabajo(elemento: Tipo_TrabajoI): Observable<any> {
  //   let Encryptado: EntidadEncriptado = {
  //     valor: this.objeto.encriptarAES(elemento)
  //   };
  //   let direccion = this.url + 'Tipo_Trabajo';
  //   return this.http.post<any>(direccion, Encryptado).pipe(
  //     map((data) => {
  //       return JSON.parse(this.objeto.decrypt(data['valor']));
  //     }),
  //     catchError((error) => {
  //       console.error('Error al obtener y desencriptar los datos', error);
  //       throw error;
  //     })
  //   );
  // }
  // PutTipoTrabajo(elemento: Tipo_TrabajoI): Observable<any> {
  //   let Encryptado: EntidadEncriptado = {
  //     valor: this.objeto.encriptarAES(elemento)
  //   };
  //   let direccion = this.url + 'Tipo_Trabajo';
  //   return this.http.put<any>(direccion, Encryptado).pipe(
  //     map((data) => {
  //       return JSON.parse(this.objeto.decrypt(data['valor']));
  //     }),
  //     catchError((error) => {
  //       console.error('Error al obtener y desencriptar los datos', error);
  //       throw error;
  //     })
  //   );
  // }
}
