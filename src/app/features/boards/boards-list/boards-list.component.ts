import { ChangeDetectionStrategy, Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { BoardsService } from '@data-access/boards.service';
import { Board, PaginatedList } from '@models/board.models';
import { BoardCardComponent } from '@shared/components/board-card/board-card.component';
import { CreateBoardModalComponent } from '../create-board-modal/create-board-modal.component';
import { UpdateBoardModalComponent } from '../update-board-modal/update-board-modal.component';

@Component({
    selector: 'app-boards-list',
    standalone: true,
    imports: [CommonModule, BoardCardComponent, CreateBoardModalComponent, UpdateBoardModalComponent],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
    <div class="px-4 sm:px-0">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Mis Tableros</h2>
        <button (click)="showModal.set(true)" class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          + Nuevo Tablero
        </button>
      </div>

      <app-create-board-modal
        [open]="showModal()"
        (closed)="showModal.set(false)"
        (created)="load()"
      />

      <app-update-board-modal
        [open]="!!editingBoard()"
        [board]="editingBoard()"
        (closed)="editingBoard.set(null)"
        (updated)="editingBoard.set(null); load()"
      />

      @if (loading()) {
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          @for (_ of skeletons; track $index) {
            <div class="bg-white dark:bg-gray-700 rounded-lg shadow p-6 animate-pulse">
              <div class="h-5 bg-gray-200 dark:bg-gray-600 rounded w-3/4 mb-3"></div>
              <div class="h-4 bg-gray-200 dark:bg-gray-600 rounded w-full mb-2"></div>
              <div class="h-3 bg-gray-200 dark:bg-gray-600 rounded w-1/4"></div>
            </div>
          }
        </div>
      } @else {
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          @for (board of paginated()?.items; track board.id) {
            <app-board-card
              [board]="board"
              [showDelete]="true"
              [showEdit]="true"
              (clicked)="onBoardClick($event)"
              (deleted)="onDeleteBoard($event)"
              (edited)="editingBoard.set($event)"
            />
          } @empty {
            <div class="col-span-3 text-center py-16 text-gray-500 dark:text-gray-400">
              <p class="text-lg font-medium">Sin tableros todavía</p>
              <p class="text-sm mt-1">Crea tu primer tablero para organizar tus tareas.</p>
            </div>
          }
        </div>

        @if (paginated(); as p) {
          @if (p.totalPages > 1) {
            <div class="mt-8 flex items-center justify-center gap-4">
              <button (click)="prevPage()" [disabled]="!p.hasPreviousPage" class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed">
                Anterior
              </button>
              <span class="text-sm text-gray-600 dark:text-gray-400">{{ p.pageNumber }} / {{ p.totalPages }}</span>
              <button (click)="nextPage()" [disabled]="!p.hasNextPage" class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed">
                Siguiente
              </button>
            </div>
          }
        }
      }
    </div>
  `
})
export class BoardsListComponent implements OnInit {
    private readonly boardsService = inject(BoardsService);
    private readonly router = inject(Router);

    readonly skeletons = Array(6);
    readonly loading = signal(true);
    readonly paginated = signal<PaginatedList<Board> | null>(null);
    readonly currentPage = signal(1);
    readonly showModal = signal(false);
    readonly editingBoard = signal<Board | null>(null);

    ngOnInit() {
        this.load();
    }

    load() {
        this.loading.set(true);
        this.boardsService.getBoards(this.currentPage(), 20).subscribe({
            next: res => {
                this.paginated.set(res.data);
                this.loading.set(false);
            },
            error: () => this.loading.set(false)
        });
    }

    nextPage() {
        this.currentPage.update(p => p + 1);
        this.load();
    }

    prevPage() {
        this.currentPage.update(p => p - 1);
        this.load();
    }

    onBoardClick(board: Board) {
        this.router.navigate(['/boards', board.id]);
    }

    onDeleteBoard(id: string) {
        if (!confirm('¿Eliminar este tablero? Esta acción no se puede deshacer.')) return;
        this.boardsService.deleteBoard(id).subscribe({
            next: () => this.load(),
            error: () => alert('No se pudo eliminar el tablero.')
        });
    }
}
