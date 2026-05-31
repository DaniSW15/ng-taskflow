import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskStateService } from './task-state.service';

@Component({
    selector: 'app-tasks',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      
      <!-- Todo Column -->
      <div class="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 shadow">
        <h3 class="font-bold text-lg mb-4 text-gray-700 dark:text-gray-200">To Do</h3>
        <div class="space-y-3">
          @for (task of taskState.todoTasks(); track task.id) {
            <div class="bg-white dark:bg-gray-700 p-3 rounded shadow-sm border border-gray-200 dark:border-gray-600">
              <h4 class="font-semibold text-gray-800 dark:text-white">{{task.title}}</h4>
              <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">{{task.description}}</p>
            </div>
          } @empty {
            <div class="text-sm text-gray-500 italic p-2 text-center">No tasks here</div>
          }
        </div>
      </div>

      <!-- In Progress Column -->
      <div class="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 shadow">
        <h3 class="font-bold text-lg mb-4 text-gray-700 dark:text-gray-200">In Progress</h3>
        <div class="space-y-3">
          @for (task of taskState.inProgressTasks(); track task.id) {
            <div class="bg-white dark:bg-gray-700 p-3 rounded shadow-sm border border-gray-200 dark:border-gray-600">
              <h4 class="font-semibold text-gray-800 dark:text-white">{{task.title}}</h4>
              <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">{{task.description}}</p>
            </div>
          } @empty {
            <div class="text-sm text-gray-500 italic p-2 text-center">No tasks here</div>
          }
        </div>
      </div>

      <!-- Done Column -->
      <div class="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 shadow">
        <h3 class="font-bold text-lg mb-4 text-gray-700 dark:text-gray-200">Done</h3>
        <div class="space-y-3">
          @for (task of taskState.doneTasks(); track task.id) {
            <div class="bg-white dark:bg-gray-700 p-3 rounded shadow-sm border border-gray-200 dark:border-gray-600">
              <h4 class="font-semibold text-gray-800 dark:text-white">{{task.title}}</h4>
              <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">{{task.description}}</p>
            </div>
          } @empty {
            <div class="text-sm text-gray-500 italic p-2 text-center">No tasks here</div>
          }
        </div>
      </div>

    </div>
  `
})
export class TasksComponent {
    taskState = inject(TaskStateService);
}
