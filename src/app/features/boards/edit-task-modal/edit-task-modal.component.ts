import { ChangeDetectionStrategy, Component, effect, inject, input, output, signal } from '@angular/core';
import { form, FormField, required } from '@angular/forms/signals';
import { TasksService, UpdateTaskRequest } from '@data-access/tasks.service';
import { TaskItem, TaskItemStatus, TaskPriority } from '@models/task.models';

interface EditTaskModel {
    title: string;
    description: string;
    status: TaskItemStatus;
    priority: TaskPriority;
    dueDate: string;
}

@Component({
    selector: 'app-edit-task-modal',
    standalone: true,
    imports: [FormField],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
    @if (open()) {
      <div
        class="fixed inset-0 bg-black/50 z-40 flex items-center justify-center p-4"
        (click)="onBackdropClick($event)"
      >
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md z-50">
          <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Editar tarea</h2>
            <button (click)="close()" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <form (submit)="onSubmit($event)" class="px-6 py-5 space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Título <span class="text-red-500">*</span>
              </label>
              <input
                [formField]="taskForm.title"
                type="text"
                placeholder="Título de la tarea"
                class="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Descripción <span class="text-xs text-gray-400">(opcional)</span>
              </label>
              <textarea
                [formField]="taskForm.description"
                rows="2"
                placeholder="Detalles de la tarea..."
                class="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white resize-none"
              ></textarea>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Estado</label>
                <select
                  [formField]="taskForm.status"
                  class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                >
                  <option value="Todo">Por hacer</option>
                  <option value="InProgress">En progreso</option>
                  <option value="Done">Completado</option>
                  <option value="Cancelled">Cancelado</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Prioridad <span class="text-red-500">*</span>
                </label>
                <select
                  [formField]="taskForm.priority"
                  class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                >
                  <option value="Low">Baja</option>
                  <option value="Medium">Media</option>
                  <option value="High">Alta</option>
                  <option value="Critical">Crítica</option>
                </select>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Fecha límite</label>
              <input
                [formField]="taskForm.dueDate"
                type="date"
                class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white"
              />
            </div>

            @if (error()) {
              <p class="text-sm text-red-600 dark:text-red-400">{{ error() }}</p>
            }

            <div class="flex justify-end gap-3 pt-2">
              <button
                type="button"
                (click)="close()"
                class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                Cancelar
              </button>
              <button
                type="submit"
                [disabled]="loading() || taskForm().invalid()"
                class="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md disabled:opacity-50"
              >
                {{ loading() ? 'Guardando...' : 'Guardar cambios' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    }
  `
})
export class EditTaskModalComponent {
    private readonly tasksService = inject(TasksService);

    readonly open = input(false);
    readonly task = input<TaskItem | null>(null);

    readonly updated = output<void>();
    readonly closed = output<void>();

    readonly loading = signal(false);
    readonly error = signal('');

    readonly taskModel = signal<EditTaskModel>({
        title: '',
        description: '',
        status: TaskItemStatus.Todo,
        priority: TaskPriority.Medium,
        dueDate: ''
    });

    readonly taskForm = form(this.taskModel, (s) => {
        required(s.title, { message: 'El título es requerido' });
        required(s.priority, { message: 'La prioridad es requerida' });
    });

    constructor() {
        effect(() => {
            const t = this.task();
            if (t) {
                this.taskModel.set({
                    title: t.title,
                    description: t.description ?? '',
                    status: t.status,
                    priority: t.priority,
                    dueDate: t.dueDate ? t.dueDate.substring(0, 10) : ''
                });
            }
        });
    }

    onBackdropClick(event: MouseEvent) {
        if (event.target === event.currentTarget) this.close();
    }

    close() {
        this.error.set('');
        this.closed.emit();
    }

    onSubmit(event: Event) {
        event.preventDefault();
        const t = this.task();
        if (!t || this.taskForm().invalid()) return;

        this.loading.set(true);
        this.error.set('');

        const { title, description, status, priority, dueDate } = this.taskModel();
        const request: UpdateTaskRequest = {
            title,
            description: description || undefined,
            status,
            priority,
            dueDate: dueDate ? `${dueDate}T23:59:59.000Z` : undefined
        };

        this.tasksService.updateTask(t.id, request).subscribe({
            next: () => {
                this.loading.set(false);
                this.updated.emit();
            },
            error: (err: any) => {
                const e = err.error;
                this.error.set(e?.errors?.[0] ?? e?.message ?? 'Error al guardar');
                this.loading.set(false);
            }
        });
    }
}
