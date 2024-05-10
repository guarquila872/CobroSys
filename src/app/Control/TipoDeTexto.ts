import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class TipoDeTexto {
  constructor() {}
  SoloLetras(parametro: string) {
    let resultado = false;
    for (let i = 0; i < parametro.length; i++) {
      let caracterActual = parametro[i];
      if (!caracterActual.match(/^[a-zA-Z\s]*$/)) {
        return false;
      }
    }
    return true;
  }
  SoloNumeros(parametro: string) {
    if (parametro === '' || parametro === null) {
      return true;
    } else {
      for (let i = 0; i < parametro.length; i++) {
        let caracterActual = parametro[i];
        if (!caracterActual.match('^[0-9]*$')) {
          return false;
        }
      }
      return true;
    }
  }
  

  SoloNumerosDesimales(parametro: string) {
    if (parametro === '' || parametro === null) {
      return true;
    } else {
      let comaEncontrada = false;
      for (let i = 0; i < parametro.length; i++) {
        let caracterActual = parametro[i];
        if (caracterActual === '.') {
          if (comaEncontrada) {
            return false;
          } else {
            comaEncontrada = true;
          }
        } else if (!caracterActual.match('^[0-9]*$')) {
          return false;
        }
      }
      return true;
    }
  }
  SoloNumerosDesimalesValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (value === '' || value === null || this.SoloNumerosDesimales(value)) {
        return null;
      } else {
        return { soloNumerosDesimales: { value: control.value } };
      }
    };
  }
  ValidatorDeNumeros(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (value === '' || value === null || this.SoloNumeros(value)) {
        return null;
      } else {
        return { soloNumerosDesimales: { value: control.value } };
      }
    };
  }
  NumerosDiferenteDeCero(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (value != 0 && this.SoloNumeros(value)) {
        return null;
      } else {
        return { soloNumerosDesimales: { value: control.value } };
      }
    };
  }

  // ValidatorDeNumeros(): ValidatorFn {
  //   return (control: AbstractControl): { [key: string]: any } | null => {
  //     const value = control.value;
  //     if (value !== null && value !== undefined && value !== 0) {
  //       return null;
  //     } else {
  //       return { notZero: { value: control.value } };
  //     }
  //   };
  // }

  isValidPhoneNumber(phoneNumber: string): boolean {
    const pattern = /^[0-9]*$/;
    return pattern.test(phoneNumber);
  }


  ValidatorCamposDependientes(idCampo: string, contactoCampo: string): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const idControl = formGroup.get(idCampo);
      const contactoControl = formGroup.get(contactoCampo);
      if (idControl!.value == 1 ||(idControl!.value == 3 && contactoCampo != 'gest_fecha_prox_pago' )) {
        if (!contactoControl!.value || contactoControl!.value.trim() === '') {
          contactoControl!.setErrors({ ['contactoRequerido']: true });
          return { ['contactoRequerido']: true };
        }
      }
      if (contactoControl!.errors && contactoControl!.errors['contactoRequerido']) {
        delete contactoControl!.errors['contactoRequerido'];
        if (Object.keys(contactoControl!.errors).length === 0) {
          contactoControl!.setErrors(null);
        }
      }
  
      return null;
    };
  }
  ValidatorCamposDependientes2(idCampo: string, contactoCampo: string): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const idControl = formGroup.get(idCampo);
      const contactoControl = formGroup.get(contactoCampo);
      
      if (idControl!.value == 2) {
        if (!contactoControl!.value || contactoControl!.value.trim() === '') {
          contactoControl!.setErrors({ ['contactoRequerido']: true });
          return { ['contactoRequerido']: true };
        }
      }
      if (contactoControl!.errors && contactoControl!.errors['contactoRequerido']) {
        delete contactoControl!.errors['contactoRequerido'];
        if (Object.keys(contactoControl!.errors).length === 0) {
          contactoControl!.setErrors(null);
        }
      }
  
      return null;
    };
  }

  MayorQue(){

  }
  MenorQue(idCampo: string, contactoCampo: string): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const idControl = formGroup.get(idCampo);
      const contactoControl = formGroup.get(contactoCampo);
      
      if (idControl!.value == 2) {
        if (!contactoControl!.value || contactoControl!.value.trim() === '') {
          contactoControl!.setErrors({ ['contactoRequerido']: true });
          return { ['contactoRequerido']: true };
        }
      }
      if (contactoControl!.errors && contactoControl!.errors['contactoRequerido']) {
        delete contactoControl!.errors['contactoRequerido'];
        if (Object.keys(contactoControl!.errors).length === 0) {
          contactoControl!.setErrors(null);
        }
      }
  
      return null;
    };
  }



}
