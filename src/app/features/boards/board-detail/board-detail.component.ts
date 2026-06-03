import { ChangeDetectionStrategy, Component, inject, signal, input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BoardsService } from '@data-access/boards.service';
import { Board } from '@models/board.models';
import { TasksComponent } from '../../tasks/tasks.component';

@Component({
    selector: 'app-board-detail',
    standalone: true,
    imports: [CommonModule, RouterLink, TasksComponent],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
    <div>
      @if (loadingBoard()) {
        <div class="animate-pulse mb-8">
          <div class="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-2"></div>
          <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
        </div>
      } @else if (board()) {
        <div class="mb-6 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <a routerLink="/boards" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
              </svg>
            </a>
            <div>
              <h2 class="text-2xl font-bold text-gray-900 dark:text-white">{{ board()!.title }}</h2>
              @if (board()!.description) {
                <p class="text-sm text-gray-500 dark:text-gray-400">{{ board()!.description }}</p>
              }
            </div>
          </div>
        </div>
      }

      <!-- Kanban Board Component -->
      <app-tasks [boardId]="id()" />
    </div>
  `
})
export class BoardDetailComponent implements OnInit {
    private readonly boardsService = inject(BoardsService);

    readonly id = input.required<string>();
    readonly board = signal<Board | null>(null);
    readonly loadingBoard = signal(true);

    ngOnInit() {
        this.boardsService.getBoardById(this.id()).subscribe({
            next: res => { 
                this.board.set(res.data); 
                this.loadingBoard.set(false); 
            },
            error: () => this.loadingBoard.set(false)
        });
    }
}
