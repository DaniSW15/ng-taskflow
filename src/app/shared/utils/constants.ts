import { TaskItemStatus, TaskPriority } from '@models/task.models';
import { ProjectStatus } from '@models/project.models';
import { UserRole } from '@models/auth.models';

/**
 * Configuración de colores para los estados de tareas
 */
export const TASK_STATUS_COLORS: Record<TaskItemStatus, string> = {
    [TaskItemStatus.Todo]: 'bg-gray-100 text-gray-800',
    [TaskItemStatus.InProgress]: 'bg-blue-100 text-blue-800',
    [TaskItemStatus.Done]: 'bg-green-100 text-green-800',
    [TaskItemStatus.Cancelled]: 'bg-red-100 text-red-800'
};

/**
 * Etiquetas legibles para estados de tareas
 */
export const TASK_STATUS_LABELS: Record<TaskItemStatus, string> = {
    [TaskItemStatus.Todo]: 'Por Hacer',
    [TaskItemStatus.InProgress]: 'En Progreso',
    [TaskItemStatus.Done]: 'Completado',
    [TaskItemStatus.Cancelled]: 'Cancelado'
};

/**
 * Configuración de colores para prioridades
 */
export const TASK_PRIORITY_COLORS: Record<TaskPriority, string> = {
    [TaskPriority.Low]: 'bg-gray-100 text-gray-800',
    [TaskPriority.Medium]: 'bg-yellow-100 text-yellow-800',
    [TaskPriority.High]: 'bg-orange-100 text-orange-800',
    [TaskPriority.Critical]: 'bg-red-100 text-red-800'
};

/**
 * Etiquetas legibles para prioridades
 */
export const TASK_PRIORITY_LABELS: Record<TaskPriority, string> = {
    [TaskPriority.Low]: 'Baja',
    [TaskPriority.Medium]: 'Media',
    [TaskPriority.High]: 'Alta',
    [TaskPriority.Critical]: 'Crítica'
};

/**
 * Iconos para prioridades
 */
export const TASK_PRIORITY_ICONS: Record<TaskPriority, string> = {
    [TaskPriority.Low]: '⬇️',
    [TaskPriority.Medium]: '➡️',
    [TaskPriority.High]: '⬆️',
    [TaskPriority.Critical]: '🔥'
};

/**
 * Configuración de colores para estados de proyectos
 */
export const PROJECT_STATUS_COLORS: Record<ProjectStatus, string> = {
    [ProjectStatus.Planning]: 'bg-purple-100 text-purple-800',
    [ProjectStatus.Active]: 'bg-green-100 text-green-800',
    [ProjectStatus.OnHold]: 'bg-yellow-100 text-yellow-800',
    [ProjectStatus.Completed]: 'bg-blue-100 text-blue-800',
    [ProjectStatus.Cancelled]: 'bg-red-100 text-red-800'
};

/**
 * Etiquetas legibles para estados de proyectos
 */
export const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
    [ProjectStatus.Planning]: 'Planificación',
    [ProjectStatus.Active]: 'Activo',
    [ProjectStatus.OnHold]: 'En Espera',
    [ProjectStatus.Completed]: 'Completado',
    [ProjectStatus.Cancelled]: 'Cancelado'
};

/**
 * Configuración de colores para roles de usuario
 */
export const USER_ROLE_COLORS: Record<UserRole, string> = {
    [UserRole.Member]: 'bg-blue-100 text-blue-800',
    [UserRole.Admin]: 'bg-red-100 text-red-800',
    [UserRole.Analyst]: 'bg-purple-100 text-purple-800',
    [UserRole.Client]: 'bg-green-100 text-green-800'
};

/**
 * Etiquetas legibles para roles de usuario
 */
export const USER_ROLE_LABELS: Record<UserRole, string> = {
    [UserRole.Member]: 'Miembro',
    [UserRole.Admin]: 'Administrador',
    [UserRole.Analyst]: 'Analista',
    [UserRole.Client]: 'Cliente'
};

/**
 * Validaciones de contraseña (deben coincidir con el backend)
 */
export const PASSWORD_REQUIREMENTS = {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumber: true,
    requireSpecialChar: true,
    specialChars: '!@#$%^&*(),.?":{}|<>'
};

/**
 * Regex para validar contraseña
 */
export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/;

/**
 * Regex para validar email
 */
export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

/**
 * Regex para validar color hexadecimal
 */
export const HEX_COLOR_REGEX = /^#[0-9A-Fa-f]{6}$/;

/**
 * Configuración de paginación por defecto
 */
export const PAGINATION_DEFAULTS = {
    pageSize: 20,
    pageSizeOptions: [10, 20, 50, 100]
};

/**
 * Tamaños de página para scroll infinito
 */
export const INFINITE_SCROLL_PAGE_SIZE = 50;
