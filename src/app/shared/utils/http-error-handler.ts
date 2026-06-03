import { HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

/**
 * Clase utilitaria para manejar errores HTTP de forma consistente
 */
export class HttpErrorHandler {
    static handle(error: HttpErrorResponse, toastr?: ToastrService): string {
        let message = 'Ha ocurrido un error inesperado';

        if (error.error instanceof ErrorEvent) {
            // Error del lado del cliente
            message = `Error: ${error.error.message}`;
        } else {
            // Error del servidor
            if (error.status === 0) {
                message = 'No se puede conectar con el servidor. Verifica tu conexión.';
            } else if (error.status === 401) {
                message = 'No autorizado. Por favor, inicia sesión nuevamente.';
            } else if (error.status === 403) {
                message = 'No tienes permisos para realizar esta acción.';
            } else if (error.status === 404) {
                message = 'Recurso no encontrado.';
            } else if (error.status === 409) {
                message = 'Conflicto: El recurso ya existe o está en uso.';
            } else if (error.status === 422) {
                message = 'Datos de entrada inválidos.';
            } else if (error.status >= 500) {
                message = 'Error del servidor. Inténtalo más tarde.';
            }

            // Si el backend devuelve ApiResponse con mensaje personalizado
            if (error.error?.message) {
                message = error.error.message;
            }

            // Si hay errores de validación
            if (error.error?.errors && Array.isArray(error.error.errors)) {
                message = error.error.errors.join(', ');
            }
        }

        if (toastr && error.status !== 401) {
            toastr.error(message, 'Error');
        }

        return message;
    }
}

/**
 * Función helper para usar en servicios Angular
 */
export function handleHttpError(error: HttpErrorResponse): never {
    const toastr = inject(ToastrService, { optional: true });
    const message = HttpErrorHandler.handle(error, toastr ?? undefined);
    throw new Error(message);
}
