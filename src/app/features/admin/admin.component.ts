import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersTableComponent } from './users-table/users-table.component';
import { ClientsTableComponent } from './clients-table/clients-table.component';
import { ProjectsViewComponent } from './projects-view/projects-view.component';
import { TagsAdminComponent } from './tags-admin/tags-admin.component';

type TabId = 'users' | 'clients' | 'projects' | 'tags';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    CommonModule,
    UsersTableComponent,
    ClientsTableComponent,
    ProjectsViewComponent,
    TagsAdminComponent
  ],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Panel de Administración</h1>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Gestión completa del sistema
        </p>
      </div>

      <!-- Tabs -->
      <div class="border-b border-gray-200 dark:border-gray-700">
        <nav class="-mb-px flex space-x-8">
          <button
            (click)="activeTab.set('users')"
            [class]="activeTab() === 'users' 
              ? 'border-blue-500 text-blue-600 dark:text-blue-400' 
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'"
            class="whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors"
          >
            👥 Usuarios
          </button>
          <button
            (click)="activeTab.set('clients')"
            [class]="activeTab() === 'clients' 
              ? 'border-blue-500 text-blue-600 dark:text-blue-400' 
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'"
            class="whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors"
          >
            🏢 Clientes
          </button>
          <button
            (click)="activeTab.set('projects')"
            [class]="activeTab() === 'projects' 
              ? 'border-blue-500 text-blue-600 dark:text-blue-400' 
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'"
            class="whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors"
          >
            📊 Proyectos
          </button>
          <button
            (click)="activeTab.set('tags')"
            [class]="activeTab() === 'tags' 
              ? 'border-blue-500 text-blue-600 dark:text-blue-400' 
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'"
            class="whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors"
          >
            🏷️ Etiquetas
          </button>
        </nav>
      </div>

      <!-- Tab Content -->
      <div class="py-6">
        @switch (activeTab()) {
          @case ('users') {
            <app-users-table />
          }
          @case ('clients') {
            <app-clients-table />
          }
          @case ('projects') {
            <app-projects-view />
          }
          @case ('tags') {
            <app-tags-admin />
          }
        }
      </div>
    </div>
  `
})
export class AdminComponent {
  activeTab = signal<TabId>('users');
}
