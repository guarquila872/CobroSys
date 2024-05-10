import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class Alertas {
  ErrorAlRecuperarElementos() {
    Swal.fire({
      title: 'Oops....!',
      text: 'Error al intentar recuperar la información!',
      icon: 'error',
      confirmButtonColor: 'var(--color-terciario)',
      confirmButtonText: 'OK',
    });
  }
  ErrorEnLaOperacion() {
    Swal.fire({
      title: 'Error inesperado!',
      text: 'Error al intentar realizar una acción dentro del formulario!',
      icon: 'error',
      confirmButtonColor: 'var(--color-terciario)',
      confirmButtonText: 'OK',
    });
  }

  ErrorEnLaPeticion(mensaje: string) {
    Swal.fire({
        title: "Error inesperado!",
        text: mensaje,
        icon: "error",
        confirmButtonColor: "var(--color-terciario)",
        confirmButtonText: "OK"
      });
  }


  NoSeRegistranCambios() {
    const alerta = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 1500,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
      },
    });

    alerta.fire({
      icon: 'info',
      title: 'Sin Cambios',
    });
  }

  NoExistenDatos() {
    Swal.fire('Oops....!', 'No Existen Datos?', 'warning');
  }

  RegistroAgregado() {
    const alerta = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 1500,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
      },
    });

    alerta.fire({
      icon: 'success',
      title: 'Registro Agregado',
    });
  }
  RegistroActualizado() {
    const alerta = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 1500,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
      },
    });

    alerta.fire({
      icon: 'success',
      title: 'Registro Actualizado',
    });
  }

  EliminarRegistro(): Promise<boolean> {
    return Swal.fire({
      title: '¿Está seguro de eliminar el registro?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#32c2de',
      cancelButtonColor: '#f33734',
    }).then((result) => {
      if (result.isConfirmed) {
        return true;
      } else {
        return false;
      }
    });
  }
  RegistroEliminado() {
    const alerta = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 1500,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
      },
    });

    alerta.fire({
      icon: 'error',
      title: 'Registro Eliminado',
    });
  }
  PeticionModificada() {
    Swal.fire(
      'Oops....!',
      'La Peticion ha sido modificada en algun punto',
      'error'
    );
  }



// ////////////////////////////////// MENSAJES DE CONFIRMACION ///////////////////////////////////////////////////////////
MensajeConfirmacion(titulo:string,texto:string): Promise<boolean> {
  return Swal.fire({
    title: titulo,
    text: texto,
    icon: 'warning',
    showCloseButton:true,
    showCancelButton: false,
    confirmButtonText: 'Aceptar',
    // cancelButtonText: 'Cancelar',
    confirmButtonColor: '#32c2de',
    // cancelButtonColor: '#f33734',
  }).then((result) => {
    if (result.isConfirmed) {
      return true;
    } else {
      return false;
    }
  });
}

// ////////////////////////////////// MENSAJES DE NOTIFICACION ///////////////////////////////////////////////////////////
MensajeSuperiorDerechaSuccess(mensaje:string) {
  const alerta = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 1500,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer);
      toast.addEventListener('mouseleave', Swal.resumeTimer);
    },
  });

  alerta.fire({
    icon: 'success',
    title: mensaje,
  });
}
// ////////////////////////////////// MENSAJES DE NOTIFICACION ///////////////////////////////////////////////////////////
NotificacionEnviada() {
  const alerta = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 1500,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer);
      toast.addEventListener('mouseleave', Swal.resumeTimer);
    },
  });

  alerta.fire({
    icon: 'success',
    title: 'Notificacion enviada',
  });
}
// ////////////////////////////////// MENSAJES DE ALERTA ///////////////////////////////////////////////////////////
AlertaEnLaPeticion(mensaje: string) {
  Swal.fire({
      title: "Alerta!",
      text: mensaje,
      icon: "warning",
      confirmButtonColor: "var(--color-terciario)",
      confirmButtonText: "OK"
    });
}
// ////////////////////////////////// MENSAJES DE VERIFICACION ///////////////////////////////////////////////////////////
PagoVerificado() {
  const alerta = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 1500,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer);
      toast.addEventListener('mouseleave', Swal.resumeTimer);
    },
  });

    alerta.fire({
      icon: 'success',
      title: 'Pago Verificado',
    });
  }

// ////////////////////////////////// SESION SERVIDATA ///////////////////////////////////////////////////////////

  SesionIniciadaSD() {
    const alerta = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 1500,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
      },
    });

    alerta.fire({
      icon: 'success',
      title: 'Se inicio sesión en Servidata',
    });
  }
  SesionRechazadaSD() {
    const alerta = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 1500,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
      },
    });

    alerta.fire({
      icon: 'error',
      title: 'No se inicio sesión en Servidata',
    });
  }

}
