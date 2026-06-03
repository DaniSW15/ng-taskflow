import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { PASSWORD_REGEX, EMAIL_REGEX, HEX_COLOR_REGEX } from '@shared/utils/constants';

/**
 * Validador de contraseña fuerte (debe coincidir con backend)
 * Requisitos:
 * - Mínimo 8 caracteres
 * - Al menos 1 mayúscula
 * - Al menos 1 minúscula
 * - Al menos 1 número
 * - Al menos 1 carácter especial (!@#$%^&*(),.?":{}|<>)
 */
export function strongPasswordValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        if (!control.value) {
            return null; // La validación 'required' debe manejarse por separado
        }

        if (!PASSWORD_REGEX.test(control.value)) {
            return {
                strongPassword: {
                    message: 'La contraseña debe tener al menos 8 caracteres, incluyendo mayúsculas, minúsculas, números y caracteres especiales (!@#$%^&*(),.?":{}|<>)'
                }
            };
        }

        return null;
    };
}

/**
 * Validador de confirmación de contraseña
 */
export function matchPasswordValidator(passwordField: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        if (!control.parent) {
            return null;
        }

        const password = control.parent.get(passwordField)?.value;
        const confirmPassword = control.value;

        if (!confirmPassword) {
            return null;
        }

        if (password !== confirmPassword) {
            return {
                matchPassword: {
                    message: 'Las contraseñas no coinciden'
                }
            };
        }

        return null;
    };
}

/**
 * Validador de email (más estricto que el de Angular)
 */
export function emailValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        if (!control.value) {
            return null;
        }

        if (!EMAIL_REGEX.test(control.value)) {
            return {
                email: {
                    message: 'Formato de email inválido'
                }
            };
        }

        return null;
    };
}

/**
 * Validador de color hexadecimal
 */
export function hexColorValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        if (!control.value) {
            return null;
        }

        if (!HEX_COLOR_REGEX.test(control.value)) {
            return {
                hexColor: {
                    message: 'El color debe estar en formato hexadecimal (#RRGGBB)'
                }
            };
        }

        return null;
    };
}

/**
 * Validador de longitud máxima de caracteres
 */
export function maxLengthValidator(maxLength: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        if (!control.value) {
            return null;
        }

        if (control.value.length > maxLength) {
            return {
                maxlength: {
                    requiredLength: maxLength,
                    actualLength: control.value.length
                }
            };
        }

        return null;
    };
}

/**
 * Validador de fecha futura
 */
export function futureDateValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        if (!control.value) {
            return null;
        }

        const inputDate = new Date(control.value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (inputDate < today) {
            return {
                futureDate: {
                    message: 'La fecha debe ser futura'
                }
            };
        }

        return null;
    };
}

/**
 * Validador de rango de fechas
 */
export function dateRangeValidator(startDateField: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        if (!control.parent) {
            return null;
        }

        const startDate = control.parent.get(startDateField)?.value;
        const endDate = control.value;

        if (!startDate || !endDate) {
            return null;
        }

        const start = new Date(startDate);
        const end = new Date(endDate);

        if (end < start) {
            return {
                dateRange: {
                    message: 'La fecha de fin debe ser posterior a la fecha de inicio'
                }
            };
        }

        return null;
    };
}
