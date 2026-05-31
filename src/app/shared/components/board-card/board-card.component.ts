import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Board } from '@models/board.models';

@Component({
    selector: 'app-board-card',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
    <div
      (click)="clicked.emit(board())"
      class="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer border border-gray-100 dark:border-gray-700 p-6"
    >
      <h3 class="font-semibold text-gray-900 dark:text-white text-lg truncate">
        {{ board().title }}
      </h3>

      @if (board().description) {
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
          {{ board().description }}
        </p>
      }

      <div class="mt-4 flex items-center justify-between">
        <span class="inline-flex items-center px-2 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-medium">
          {{ board().taskCount }} tareas
        </span>
        <div class="flex gap-2">
          @if (showEdit()) {
            <button
              (click)="$event.stopPropagation(); edited.emit(board())"
              class="text-gray-400 hover:text-blue-600 text-xs"
            >
              Editar
            </button>
          }
          @if (showDelete()) {
            <button
              (click)="$event.stopPropagation(); deleted.emit(board().id)"
              class="text-red-400 hover:text-red-600 text-xs"
            >
              Eliminar
            </button>
          }
        </div>
      </div>
    </div>
  `
})
export class BoardCardComponent {
    readonly board = input.required<Board>();
    readonly showDelete = input(false);
    readonly showEdit = input(false);

    readonly clicked = output<Board>();
    readonly deleted = output<string>();
    readonly edited = output<Board>();
}
