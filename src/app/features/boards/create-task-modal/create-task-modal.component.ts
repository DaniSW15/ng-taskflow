import { ChangeDetectionStrategy, Component, inject, input, output, signal } from '@angular/core';
import { form, FormField, required } from '@angular/forms/signals';
import { TasksService } from '@data-access/tasks.service';
import { TaskPriority } from '@models/task.models';

interface CreateTaskModel {
    title: string;
    description: string;
    priority: TaskPriority;
    dueDate: string;
}

@Component({
    selector: 'app-create-task-modal',
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
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Nueva tarea</h2>
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
                placeholder="Ej: Diseñar landing page"
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

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Fecha límite
                </label>
                <input
                  [formField]="taskForm.dueDate"
                  type="date"
                  class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                />
              </div>
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
                {{ loading() ? 'Creando...' : 'Crear tarea' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    }
  `
})
export class CreateTaskModalComponent {
    private readonly tasksService = inject(TasksService);

    readonly open = input(false);
    readonly boardId = input.required<string>();

    readonly created = output<void>();
    readonly closed = output<void>();

    readonly loading = signal(false);
    readonly error = signal('');

    readonly taskModel = signal<CreateTaskModel>({
        title: '',
        description: '',
        priority: TaskPriority.Medium,
        dueDate: ''
    });

    readonly taskForm = form(this.taskModel, (s) => {
        required(s.title, { message: 'El título es requerido' });
        required(s.priority, { message: 'La prioridad es requerida' });
    });

    onSubmit(event: Event) {
        event.preventDefault();
        if (this.taskForm().invalid()) return;

        this.loading.set(true);
        this.error.set('');

        const { title, description, priority, dueDate } = this.taskModel();
        this.tasksService.createTask(this.boardId(), {
            title,
            description: description || undefined,
            priority,
            dueDate: dueDate ? `${dueDate}T23:59:59.000Z` : undefined
        }).subscribe({
            next: () => {
                this.loading.set(false);
                this.resetForm();
                this.closed.emit();
                this.created.emit();
            },
            error: (err: any) => {
                const e = err.error;
                this.error.set(e?.errors?.[0] ?? e?.message ?? 'Error al crear la tarea');
                this.loading.set(false);
            }
        });
    }

    close() {
        this.resetForm();
        this.closed.emit();
    }

    onBackdropClick(event: MouseEvent) {
        if (event.target === event.currentTarget) this.close();
    }

    private resetForm() {
        this.taskModel.set({ title: '', description: '', priority: TaskPriority.Medium, dueDate: '' });
        this.error.set('');
    }
}
