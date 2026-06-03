import { ChangeDetectionStrategy, Component, inject, input, output, signal } from '@angular/core';
import { form, FormField, required } from '@angular/forms/signals';
import { BoardsService } from '@data-access/boards.service';
import { Board } from '@models/board.models';

interface CreateBoardModel {
  title: string;
  description: string;
}

@Component({
  selector: 'app-create-board-modal',
  standalone: true,
  imports: [FormField],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (open()) {
      <!-- Backdrop -->
      <div
        class="fixed inset-0 bg-black/50 z-40 flex items-center justify-center p-4"
        (click)="onBackdropClick($event)"
      >
        <!-- Modal -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md z-50">
          <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Nuevo tablero</h2>
            <button (click)="close()" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <form (submit)="onSubmit($event)" class="px-6 py-5 space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Nombre <span class="text-red-500">*</span>
              </label>
              <input
                [formField]="boardForm.title"
                type="text"
                placeholder="Mi proyecto"
                class="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Descripción <span class="text-xs text-gray-400">(opcional)</span>
              </label>
              <textarea
                [formField]="boardForm.description"
                rows="3"
                placeholder="¿De qué trata este tablero?"
                class="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white resize-none"
              ></textarea>
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
                [disabled]="loading() || boardForm().invalid()"
                class="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md disabled:opacity-50"
              >
                {{ loading() ? 'Creando...' : 'Crear tablero' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    }
  `
})
export class CreateBoardModalComponent {
  private readonly boardsService = inject(BoardsService);

  // input del padre: controla si el modal está abierto
  readonly open = input(false);

  // outputs hacia el padre
  readonly closed = output<void>();
  readonly created = output<Board>();

  readonly loading = signal(false);
  readonly error = signal('');

  readonly boardModel = signal<CreateBoardModel>({ title: '', description: '' });

  readonly boardForm = form(this.boardModel, (s) => {
    required(s.title, { message: 'El nombre es requerido' });
  });

  onSubmit(event: Event) {
    event.preventDefault();
    if (this.boardForm().invalid()) return;

    this.loading.set(true);
    this.error.set('');

    const { title, description } = this.boardModel();
    this.boardsService.createBoard({
      title,
      description: description || undefined
    }).subscribe({
      next: () => {
        this.loading.set(false);
        this.resetForm();
        this.closed.emit();
        // Emitir un Board parcial para que el padre recargue la lista
        this.created.emit({ title } as Board);
      },
      error: (err: any) => {
        this.error.set(err.error?.message ?? 'Error al crear el tablero');
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
    this.boardModel.set({ title: '', description: '' });
    this.error.set('');
  }
}
