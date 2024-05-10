import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.css'],
})
export class ReportesComponent implements OnInit {
  ngOnInit(): void {
    this.getCurrentDate();
  }
  constructor() {}
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
}
