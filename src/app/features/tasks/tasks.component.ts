import { Component, inject, signal, computed, input, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

import { TasksService } from '@data-access/tasks.service';
import { TaskItem, TaskItemStatus, TaskPriority } from '@models/task.models';
import { TaskStatusPipe } from '@shared/pipes/task-status.pipe';
import { TaskPriorityPipe } from '@shared/pipes/task-priority.pipe';
import { TASK_PRIORITY_COLORS, TASK_STATUS_COLORS } from '@shared/utils/constants';
import { isOverdue } from '@shared/utils/api-helpers';
import { CreateTaskModalComponent } from '../boards/create-task-modal/create-task-modal.component';
import { EditTaskModalComponent } from '../boards/edit-task-modal/edit-task-modal.component';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [
    CommonModule,
    DragDropModule,
    FormsModule,
    TaskPriorityPipe,
    CreateTaskModalComponent,
    EditTaskModalComponent
  ],
  styles: [`
      .cdk-drag-preview {
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        opacity: 0.9;
        border-radius: 0.5rem;
      }
      .cdk-drag-animating {
        transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
      }
      .kanban-list.cdk-drop-list-dragging .kanban-card:not(.cdk-drag-placeholder) {
        transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
      }
      .cdk-drag-placeholder {
        opacity: 0.4;
        background: #e5e7eb;
        border: 2px dashed #9ca3af;
      }
    `],
  template: `
    <div class="p-6 max-w-screen-2xl mx-auto">
      <!-- Header con filtros -->
      <div class="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Tablero Kanban</h1>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Total: {{ allTasks().length }} tareas
          </p>
        </div>

        <div class="flex gap-3 flex-wrap">
          <!-- Búsqueda -->
          <input
            type="search"
            [(ngModel)]="searchQuery"
            (ngModelChange)="onSearch($event)"
            placeholder="Buscar tareas..."
            class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm"
          />

          <!-- Filtro de prioridad -->
          <select
            [(ngModel)]="priorityFilter"
            (ngModelChange)="onFilterChange()"
            class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm"
          >
            <option value="">Todas las prioridades</option>
            <option value="Low">Baja</option>
            <option value="Medium">Media</option>
            <option value="High">Alta</option>
            <option value="Critical">Crítica</option>
          </select>

          <!-- Botón nueva tarea -->
          <button
            (click)="openCreateModal()"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center gap-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
            </svg>
            Nueva Tarea
          </button>
        </div>
      </div>

      <!-- Kanban Board -->
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <!-- Columna: Por Hacer -->
        <div class="flex flex-col bg-gray-50 dark:bg-gray-800 rounded-xl p-4 min-h-150">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 rounded-full" [style.background-color]="getStatusColor(TaskItemStatus.Todo)"></div>
              <h3 class="font-semibold text-gray-900 dark:text-white">Por Hacer</h3>
            </div>
            <span class="px-2 py-1 text-xs font-medium bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full">
              {{ todoTasks().length }}
            </span>
          </div>
          
          <div
            cdkDropList
            #todoList="cdkDropList"
            [cdkDropListData]="todoTasks()"
            [cdkDropListConnectedTo]="[inProgressList, doneList, cancelledList]"
            (cdkDropListDropped)="onDrop($event, TaskItemStatus.Todo)"
            class="kanban-list flex-1 space-y-3 min-h-50"
          >
            @for (task of todoTasks(); track task.id) {
              <div
                cdkDrag
                (click)="openEditModal(task)"
                class="kanban-card bg-white dark:bg-gray-700 rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-200 dark:border-gray-600"
              >
                <div class="flex items-start justify-between mb-2">
                  <h4 class="font-medium text-gray-900 dark:text-white text-sm flex-1">{{ task.title }}</h4>
                  <span 
                    class="px-2 py-0.5 text-xs font-semibold rounded"
                    [style.background-color]="getPriorityColor(task.priority)"
                    [style.color]="'white'"
                  >
                    {{ task.priority | taskPriority }}
                  </span>
                </div>
                
                @if (task.description) {
                  <p class="text-xs text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                    {{ task.description }}
                  </p>
                }

                <div class="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                  @if (task.dueDate) {
                    <span [class.text-red-600]="isTaskOverdue(task)" [class.font-semibold]="isTaskOverdue(task)">
                      📅 {{ task.dueDate | date:'dd/MM/yyyy' }}
                    </span>
                  }
                  @if (task.tags && task.tags.length > 0) {
                    <div class="flex gap-1">
                      @for (tag of task.tags.slice(0, 2); track tag.id) {
                        <span class="px-1.5 py-0.5 rounded text-xs" [style.background-color]="tag.color + '20'" [style.color]="tag.color">
                          {{ tag.name }}
                        </span>
                      }
                    </div>
                  }
                </div>
              </div>
            } @empty {
              <div class="flex items-center justify-center h-full text-sm text-gray-400 dark:text-gray-500 italic">
                No hay tareas
              </div>
            }
          </div>
        </div>

        <!-- Columna: En Progreso -->
        <div class="flex flex-col bg-gray-50 dark:bg-gray-800 rounded-xl p-4 min-h-150">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 rounded-full" [style.background-color]="getStatusColor(TaskItemStatus.InProgress)"></div>
              <h3 class="font-semibold text-gray-900 dark:text-white">En Progreso</h3>
            </div>
            <span class="px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full">
              {{ inProgressTasks().length }}
            </span>
          </div>
          
          <div
            cdkDropList
            #inProgressList="cdkDropList"
            [cdkDropListData]="inProgressTasks()"
            [cdkDropListConnectedTo]="[todoList, doneList, cancelledList]"
            (cdkDropListDropped)="onDrop($event, TaskItemStatus.InProgress)"
            class="kanban-list flex-1 space-y-3 min-h-50"
          >
            @for (task of inProgressTasks(); track task.id) {
              <div
                cdkDrag
                (click)="openEditModal(task)"
                class="kanban-card bg-white dark:bg-gray-700 rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-200 dark:border-gray-600"
              >
                <div class="flex items-start justify-between mb-2">
                  <h4 class="font-medium text-gray-900 dark:text-white text-sm flex-1">{{ task.title }}</h4>
                  <span 
                    class="px-2 py-0.5 text-xs font-semibold rounded"
                    [style.background-color]="getPriorityColor(task.priority)"
                    [style.color]="'white'"
                  >
                    {{ task.priority | taskPriority }}
                  </span>
                </div>
                
                @if (task.description) {
                  <p class="text-xs text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                    {{ task.description }}
                  </p>
                }

                <div class="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                  @if (task.dueDate) {
                    <span [class.text-red-600]="isTaskOverdue(task)" [class.font-semibold]="isTaskOverdue(task)">
                      📅 {{ task.dueDate | date:'dd/MM/yyyy' }}
                    </span>
                  }
                  @if (task.tags && task.tags.length > 0) {
                    <div class="flex gap-1">
                      @for (tag of task.tags.slice(0, 2); track tag.id) {
                        <span class="px-1.5 py-0.5 rounded text-xs" [style.background-color]="tag.color + '20'" [style.color]="tag.color">
                          {{ tag.name }}
                        </span>
                      }
                    </div>
                  }
                </div>
              </div>
            } @empty {
              <div class="flex items-center justify-center h-full text-sm text-gray-400 dark:text-gray-500 italic">
                No hay tareas
              </div>
            }
          </div>
        </div>

        <!-- Columna: Completado -->
        <div class="flex flex-col bg-gray-50 dark:bg-gray-800 rounded-xl p-4 min-h-150">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 rounded-full" [style.background-color]="getStatusColor(TaskItemStatus.Done)"></div>
              <h3 class="font-semibold text-gray-900 dark:text-white">Completado</h3>
            </div>
            <span class="px-2 py-1 text-xs font-medium bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full">
              {{ doneTasks().length }}
            </span>
          </div>
          
          <div
            cdkDropList
            #doneList="cdkDropList"
            [cdkDropListData]="doneTasks()"
            [cdkDropListConnectedTo]="[todoList, inProgressList, cancelledList]"
            (cdkDropListDropped)="onDrop($event, TaskItemStatus.Done)"
            class="kanban-list flex-1 space-y-3 min-h-50"
          >
            @for (task of doneTasks(); track task.id) {
              <div
                cdkDrag
                (click)="openEditModal(task)"
                class="kanban-card bg-white dark:bg-gray-700 rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-200 dark:border-gray-600 opacity-75"
              >
                <div class="flex items-start justify-between mb-2">
                  <h4 class="font-medium text-gray-900 dark:text-white text-sm flex-1 line-through">{{ task.title }}</h4>
                  <span 
                    class="px-2 py-0.5 text-xs font-semibold rounded"
                    [style.background-color]="getPriorityColor(task.priority)"
                    [style.color]="'white'"
                  >
                    {{ task.priority | taskPriority }}
                  </span>
                </div>
                
                @if (task.description) {
                  <p class="text-xs text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                    {{ task.description }}
                  </p>
                }

                <div class="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                  @if (task.dueDate) {
                    <span>
                      📅 {{ task.dueDate | date:'dd/MM/yyyy' }}
                    </span>
                  }
                  @if (task.tags && task.tags.length > 0) {
                    <div class="flex gap-1">
                      @for (tag of task.tags.slice(0, 2); track tag.id) {
                        <span class="px-1.5 py-0.5 rounded text-xs" [style.background-color]="tag.color + '20'" [style.color]="tag.color">
                          {{ tag.name }}
                        </span>
                      }
                    </div>
                  }
                </div>
              </div>
            } @empty {
              <div class="flex items-center justify-center h-full text-sm text-gray-400 dark:text-gray-500 italic">
                No hay tareas
              </div>
            }
          </div>
        </div>

        <!-- Columna: Cancelado -->
        <div class="flex flex-col bg-gray-50 dark:bg-gray-800 rounded-xl p-4 min-h-150">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 rounded-full" [style.background-color]="getStatusColor(TaskItemStatus.Cancelled)"></div>
              <h3 class="font-semibold text-gray-900 dark:text-white">Cancelado</h3>
            </div>
            <span class="px-2 py-1 text-xs font-medium bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-full">
              {{ cancelledTasks().length }}
            </span>
          </div>
          
          <div
            cdkDropList
            #cancelledList="cdkDropList"
            [cdkDropListData]="cancelledTasks()"
            [cdkDropListConnectedTo]="[todoList, inProgressList, doneList]"
            (cdkDropListDropped)="onDrop($event, TaskItemStatus.Cancelled)"
            class="kanban-list flex-1 space-y-3 min-h-50"
          >
            @for (task of cancelledTasks(); track task.id) {
              <div
                cdkDrag
                (click)="openEditModal(task)"
                class="kanban-card bg-white dark:bg-gray-700 rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-200 dark:border-gray-600 opacity-60"
              >
                <div class="flex items-start justify-between mb-2">
                  <h4 class="font-medium text-gray-900 dark:text-white text-sm flex-1 line-through">{{ task.title }}</h4>
                  <span 
                    class="px-2 py-0.5 text-xs font-semibold rounded"
                    [style.background-color]="getPriorityColor(task.priority)"
                    [style.color]="'white'"
                  >
                    {{ task.priority | taskPriority }}
                  </span>
                </div>
                
                @if (task.description) {
                  <p class="text-xs text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                    {{ task.description }}
                  </p>
                }

                <div class="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                  @if (task.dueDate) {
                    <span>
                      📅 {{ task.dueDate | date:'dd/MM/yyyy' }}
                    </span>
                  }
                  @if (task.tags && task.tags.length > 0) {
                    <div class="flex gap-1">
                      @for (tag of task.tags.slice(0, 2); track tag.id) {
                        <span class="px-1.5 py-0.5 rounded text-xs" [style.background-color]="tag.color + '20'" [style.color]="tag.color">
                          {{ tag.name }}
                        </span>
                      }
                    </div>
                  }
                </div>
              </div>
            } @empty {
              <div class="flex items-center justify-center h-full text-sm text-gray-400 dark:text-gray-500 italic">
                No hay tareas
              </div>
            }
          </div>
        </div>
      </div>

      <!-- Loading overlay -->
      @if (loading()) {
        <div class="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
          <div class="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-xl">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </div>
      }
    </div>

    <!-- Modales -->
    <app-create-task-modal 
      [open]="showCreateModal()"
      [boardId]="boardId()"
      (closed)="closeCreateModal()"
      (created)="onTaskCreated()"
    />

    <app-edit-task-modal
      [open]="showEditModal()"
      [task]="selectedTask()"
      (closed)="closeEditModal()"
      (updated)="onTaskUpdated()"
      (deleted)="onTaskDeleted()"
    />
  `
})
export class TasksComponent {
  private tasksService = inject(TasksService);
  private toastr = inject(ToastrService);

  // Enum para el template
  readonly TaskItemStatus = TaskItemStatus;

  // Input para el boardId
  boardId = input.required<string>();

  // Estado
  private allTasksData = signal<TaskItem[]>([]);
  loading = signal(false);
  searchQuery = '';
  priorityFilter: TaskPriority | '' = '';

  // Modales
  showCreateModal = signal(false);
  showEditModal = signal(false);
  selectedTask = signal<TaskItem | null>(null);

  // Tasks filtradas
  allTasks = computed(() => {
    let tasks = this.allTasksData();

    // Filtro de búsqueda
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      tasks = tasks.filter(t =>
        t.title.toLowerCase().includes(query) ||
        t.description?.toLowerCase().includes(query)
      );
    }

    // Filtro de prioridad
    if (this.priorityFilter) {
      tasks = tasks.filter(t => t.priority === this.priorityFilter);
    }

    return tasks;
  });

  todoTasks = computed(() => this.allTasks().filter(t => t.status === TaskItemStatus.Todo));
  inProgressTasks = computed(() => this.allTasks().filter(t => t.status === TaskItemStatus.InProgress));
  doneTasks = computed(() => this.allTasks().filter(t => t.status === TaskItemStatus.Done));
  cancelledTasks = computed(() => this.allTasks().filter(t => t.status === TaskItemStatus.Cancelled));

  constructor() {
    effect(() => {
      const id = this.boardId();
      if (id) {
        this.loadTasks();
      }
    });
  }

  loadTasks() {
    this.loading.set(true);
    this.tasksService.getTasksByBoard(this.boardId(), 1, 100).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.allTasksData.set(response.data.items);
        }
        this.loading.set(false);
      },
      error: () => {
        this.toastr.error('Error al cargar tareas');
        this.loading.set(false);
      }
    });
  }

  onDrop(event: CdkDragDrop<TaskItem[]>, targetStatus: TaskItemStatus) {
    const task = event.item.data || event.previousContainer.data[event.previousIndex];

    if (event.previousContainer === event.container) {
      // Mismo contenedor - solo reordenar
      const items = [...event.container.data];
      moveItemInArray(items, event.previousIndex, event.currentIndex);
    } else {
      // Diferente contenedor - mover y actualizar status
      const movedTask = event.previousContainer.data[event.previousIndex];

      // Actualizar en el backend
      this.loading.set(true);
      this.tasksService.updateTask(movedTask.id, {
        title: movedTask.title,
        description: movedTask.description,
        status: targetStatus,
        priority: movedTask.priority,
        dueDate: movedTask.dueDate,
        assigneeId: movedTask.assigneeId
      }).subscribe({
        next: () => {
          // Actualizar localmente
          this.allTasksData.update(tasks =>
            tasks.map(t => t.id === movedTask.id ? { ...t, status: targetStatus } : t)
          );
          this.toastr.success('Tarea actualizada');
          this.loading.set(false);
        },
        error: () => {
          this.toastr.error('Error al mover la tarea');
          this.loading.set(false);
        }
      });
    }
  }

  onSearch(query: string) {
    this.searchQuery = query;
  }

  onFilterChange() {
    // El computed se actualizará automáticamente
  }

  openCreateModal() {
    this.showCreateModal.set(true);
  }

  closeCreateModal() {
    this.showCreateModal.set(false);
  }

  onTaskCreated() {
    this.closeCreateModal();
    this.loadTasks();
  }

  openEditModal(task: TaskItem) {
    this.selectedTask.set(task);
    this.showEditModal.set(true);
  }

  closeEditModal() {
    this.showEditModal.set(false);
    this.selectedTask.set(null);
  }

  onTaskUpdated() {
    this.closeEditModal();
    this.loadTasks();
  }

  onTaskDeleted() {
    this.closeEditModal();
    this.loadTasks();
  }

  getPriorityColor(priority: TaskPriority): string {
    return TASK_PRIORITY_COLORS[priority];
  }

  getStatusColor(status: TaskItemStatus): string {
    return TASK_STATUS_COLORS[status];
  }

  isTaskOverdue(task: TaskItem): boolean {
    return task.dueDate ? isOverdue(task.dueDate) : false;
  }
}
