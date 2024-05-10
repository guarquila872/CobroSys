import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { catchError, map } from 'rxjs';
import { TipoDeTexto } from 'src/app/Control/TipoDeTexto';
import { ApiService } from 'src/app/service/api.service';
import { SignalRService } from 'src/app/service/signalr.service';
import * as signalR from '@microsoft/signalr';
@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css'],
})
export class PerfilComponent implements OnInit {
  
  // message: string = '';
  Sms_Recivido: {message: string, user: string}[] = [] ;

  constructor(private signalRService: SignalRService) { }

  ngOnInit(): void {
    this.signalRService.startConnection();
    this.signalRService.ReciveMensaje((sms: string, us: string) => {
      this.Sms_Recivido.push({message:sms,user:us});
    });
  }

  mensaje = new FormControl('', Validators.required)
  sendMessage() {
    this.signalRService.EnvioMensaje(this.mensaje.value!);
    this.mensaje.patchValue('');
  }

  // message: string = '';
  // receivedMessage: string = '';

  // constructor(private signalRService: SignalRService) { }

  // ngOnInit(): void {
  //   this.signalRService.startConnection();
  //   this.signalRService.ReciveMensaje((message: string) => {
  //     this.receivedMessage = message;
  //     console.log(message);
  //   });
  // }

  // mensaje = new FormControl('', Validators.required)

  // sendMessage(mensaje:string) {
  //   this.signalRService.EnvioMensaje(mensaje);
  //   this.mensaje.patchValue('');
  // }

}
