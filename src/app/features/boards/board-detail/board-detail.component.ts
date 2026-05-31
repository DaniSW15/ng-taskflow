import { ChangeDetectionStrategy, Component, inject, signal, input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BoardsService } from '@data-access/boards.service';
import { TasksService } from '@data-access/tasks.service';
import { UpdateTaskRequest } from '@data-access/tasks.service';
import { Board } from '@models/board.models';
import { TaskItem, TaskItemStatus, TaskPriority } from '@models/task.models';
import { CreateTaskModalComponent } from '../create-task-modal/create-task-modal.component';
import { EditTaskModalComponent } from '../edit-task-modal/edit-task-modal.component';

@Component({
    selector: 'app-board-detail',
    standalone: true,
    imports: [CommonModule, RouterLink, CreateTaskModalComponent, EditTaskModalComponent],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
    <div>
      @if (loadingBoard()) {
        <div class="animate-pulse">
          <div class="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-2"></div>
          <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
        </div>
      } @else if (board()) {
        <div class="mb-6 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <a routerLink="/boards" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
          </a>
          <div>
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white">{{ board()!.title }}</h2>
            @if (board()!.description) {
              <p class="text-sm text-gray-500 dark:text-gray-400">{{ board()!.description }}</p>
            }
          </div>
          </div>
          <button
            (click)="showTaskModal.set(true)"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            + Nueva tarea
          </button>
        </div>
      }

      <app-create-task-modal
        [open]="showTaskModal()"
        [boardId]="id()"
        (closed)="showTaskModal.set(false)"
        (created)="loadTasks()"
      />

      <app-edit-task-modal
        [open]="!!editingTask()"
        [task]="editingTask()"
        (closed)="editingTask.set(null)"
        (updated)="editingTask.set(null); loadTasks()"
      />

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        @for (col of columns; track col.status) {
          <div class="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
            <h3 class="font-semibold text-sm uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-4">
              {{ col.label }}
              <span class="ml-2 inline-flex items-center justify-center w-5 h-5 text-xs rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                {{ tasksByStatus(col.status).length }}
              </span>
            </h3>
            <div class="space-y-3">
              @if (loadingTasks()) {
                @for (_ of [1,2]; track $index) {
                  <div class="bg-white dark:bg-gray-700 rounded p-3 animate-pulse">
                    <div class="h-4 bg-gray-200 dark:bg-gray-600 rounded w-3/4 mb-2"></div>
                    <div class="h-3 bg-gray-200 dark:bg-gray-600 rounded w-full"></div>
                  </div>
                }
              } @else {
                @for (task of tasksByStatus(col.status); track task.id) {
                  <div class="bg-white dark:bg-gray-700 rounded-md p-3 shadow-sm border border-gray-200 dark:border-gray-600">
                    <div class="flex items-start justify-between gap-2">
                      <h4 class="text-sm font-medium text-gray-800 dark:text-white leading-tight">{{ task.title }}</h4>
                      <span [class]="priorityClass(task.priority)" class="shrink-0 inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium">
                        {{ task.priority }}
                      </span>
                    </div>
                    @if (task.description) {
                      <p class="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{{ task.description }}</p>
                    }
                    @if (task.assigneeName) {
                      <p class="text-xs text-gray-400 mt-2">{{ task.assigneeName }}</p>
                    }
                    <!-- Acciones -->
                    <div class="mt-3 flex items-center justify-between gap-1">
                      <div class="flex gap-1">
                        @if (task.status !== 'Todo') {
                          <button (click)="moveTask(task, prevStatus(task.status))" class="text-xs px-2 py-0.5 rounded border border-gray-300 dark:border-gray-500 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600">
                            ← Retroceder
                          </button>
                        }
                        @if (task.status !== 'Done') {
                          <button (click)="moveTask(task, nextStatus(task.status))" class="text-xs px-2 py-0.5 rounded border border-blue-300 dark:border-blue-700 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30">
                            Avanzar →
                          </button>
                        }
                      </div>
                      <div class="flex gap-2">
                        <button (click)="editingTask.set(task)" class="text-xs text-gray-400 hover:text-blue-600">
                          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                        </button>
                        <button (click)="deleteTask(task.id)" class="text-xs text-red-400 hover:text-red-600">
                          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                        </button>
                      </div>
                    </div>
                  </div>
                } @empty {
                  <p class="text-xs text-gray-400 italic text-center py-4">Sin tareas</p>
                }
              }
            </div>
          </div>
        }
      </div>
    </div>
  `
})
export class BoardDetailComponent implements OnInit {
    private readonly boardsService = inject(BoardsService);
    private readonly tasksService = inject(TasksService);

    readonly id = input.required<string>();

    readonly board = signal<Board | null>(null);
    readonly tasks = signal<TaskItem[]>([]);
    readonly loadingBoard = signal(true);
    readonly loadingTasks = signal(true);
    readonly showTaskModal = signal(false);
    readonly editingTask = signal<TaskItem | null>(null);

    readonly columns = [
        { status: TaskItemStatus.Todo, label: 'Por hacer' },
        { status: TaskItemStatus.InProgress, label: 'En progreso' },
        { status: TaskItemStatus.Done, label: 'Completado' }
    ];

    ngOnInit() {
        this.boardsService.getBoardById(this.id()).subscribe({
            next: res => { this.board.set(res.data); this.loadingBoard.set(false); },
            error: () => this.loadingBoard.set(false)
        });
        this.loadTasks();
    }

    loadTasks() {
        this.loadingTasks.set(true);
        this.tasksService.getTasksByBoard(this.id()).subscribe({
            next: res => { this.tasks.set(res.data.items); this.loadingTasks.set(false); },
            error: () => this.loadingTasks.set(false)
        });
    }

    tasksByStatus(status: TaskItemStatus): TaskItem[] {
        return this.tasks().filter(t => t.status === status);
    }

    priorityClass(priority: string): string {
        const map: Record<string, string> = {
            Low: 'bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300',
            Medium: 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300',
            High: 'bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300',
            Critical: 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300'
        };
        return map[priority] ?? '';
    }

    nextStatus(status: TaskItemStatus): TaskItemStatus {
        const order = [TaskItemStatus.Todo, TaskItemStatus.InProgress, TaskItemStatus.Done];
        return order[order.indexOf(status) + 1] ?? status;
    }

    prevStatus(status: TaskItemStatus): TaskItemStatus {
        const order = [TaskItemStatus.Todo, TaskItemStatus.InProgress, TaskItemStatus.Done];
        return order[order.indexOf(status) - 1] ?? status;
    }

    moveTask(task: TaskItem, newStatus: TaskItemStatus) {
        const request: UpdateTaskRequest = {
            title: task.title,
            description: task.description,
            status: newStatus,
            priority: task.priority,
            dueDate: task.dueDate,
            assigneeId: task.assigneeId
        };
        this.tasksService.updateTask(task.id, request).subscribe({
            next: () => this.loadTasks(),
            error: () => alert('No se pudo actualizar la tarea.')
        });
    }

    deleteTask(id: string) {
        if (!confirm('¿Eliminar esta tarea?')) return;
        this.tasksService.deleteTask(id).subscribe({
            next: () => this.tasks.update(tasks => tasks.filter(t => t.id !== id)),
            error: () => alert('No se pudo eliminar la tarea.')
        });
    }
}
