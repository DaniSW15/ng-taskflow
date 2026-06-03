import { Observable, map } from 'rxjs';
import { ApiResponse } from '@models/board.models';

/**
 * Extrae el campo 'data' de una ApiResponse
 */
export function extractData<T>() {
    return (source: Observable<ApiResponse<T>>): Observable<T> => {
        return source.pipe(
            map(response => {
                if (!response.success) {
                    throw new Error(response.message || 'Error en la respuesta de la API');
                }
                return response.data;
            })
        );
    };
}

/**
 * Verifica si la respuesta de la API fue exitosa
 */
export function isApiSuccess<T>(response: ApiResponse<T>): boolean {
    return response.success && response.data !== null;
}

/**
 * Formatea fechas ISO a formato local
 */
export function formatDate(isoDate: string | undefined): string {
    if (!isoDate) return '';
    return new Date(isoDate).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

/**
 * Formatea fechas ISO a formato corto
 */
export function formatDateShort(isoDate: string | undefined): string {
    if (!isoDate) return '';
    return new Date(isoDate).toLocaleDateString('es-ES');
}

/**
 * Verifica si una fecha está vencida
 */
export function isOverdue(dueDate: string | undefined): boolean {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date();
}
