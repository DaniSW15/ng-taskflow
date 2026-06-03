import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

import { ProjectsService } from '@data-access/projects.service';
import { Project, ProjectStatus } from '@models/project.models';
import { ProjectStatusPipe } from '@shared/pipes/project-status.pipe';
import { PROJECT_STATUS_COLORS } from '@shared/utils/constants';

@Component({
    selector: 'app-projects-view',
    standalone: true,
    imports: [CommonModule, FormsModule, ProjectStatusPipe],
    template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Proyectos</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Total: {{ filteredProjects().length }} proyectos
          </p>
        </div>
        <div class="flex gap-3">
          <input
            type="search"
            [(ngModel)]="searchQuery"
            (ngModelChange)="onSearch()"
            placeholder="Buscar proyectos..."
            class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm"
          />
          <select
            [(ngModel)]="statusFilter"
            (ngModelChange)="onFilterChange()"
            class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm"
          >
            <option value="">Todos los estados</option>
            <option value="Planning">Planificación</option>
            <option value="Active">Activo</option>
            <option value="OnHold">En Pausa</option>
            <option value="Completed">Completado</option>
            <option value="Cancelled">Cancelado</option>
          </select>
          <button
            (click)="toggleView()"
            class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            {{ viewMode() === 'table' ? '📊 Cards' : '📋 Tabla' }}
          </button>
          <button
            (click)="createProject()"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center gap-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
            </svg>
            Nuevo Proyecto
          </button>
        </div>
      </div>

      @if (loading()) {
        <div class="p-8 text-center">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      } @else {
        @if (viewMode() === 'table') {
          <!-- Table View -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead class="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Proyecto
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Cliente
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Estado
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Progreso
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Fechas
                    </th>
                    <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  @for (project of filteredProjects(); track project.id) {
                    <tr class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <td class="px-6 py-4">
                        <div class="text-sm font-medium text-gray-900 dark:text-white">
                          {{ project.title }}
                        </div>
                        @if (project.description) {
                          <div class="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
                            {{ project.description }}
                          </div>
                        }
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm text-gray-900 dark:text-gray-300">
                          {{ project.clientName || '-' }}
                        </div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <span 
                          class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
                          [style.background-color]="getStatusColor(project.status) + '20'"
                          [style.color]="getStatusColor(project.status)"
                        >
                          {{ project.status | projectStatus }}
                        </span>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="w-24">
                          <div class="text-xs text-gray-600 dark:text-gray-400 mb-1">
                            {{ project.boardCount }} board(s)
                          </div>
                        </div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        <div>{{ project.startDate | date:'dd/MM/yyyy' }}</div>
                        @if (project.endDate) {
                          <div class="text-xs">{{ project.endDate | date:'dd/MM/yyyy' }}</div>
                        }
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          (click)="editProject(project)"
                          class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-4"
                        >
                          Editar
                        </button>
                        <button
                          (click)="deleteProject(project.id)"
                          class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  } @empty {
                    <tr>
                      <td colspan="6" class="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                        No se encontraron proyectos
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </div>
        } @else {
          <!-- Cards View -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            @for (project of filteredProjects(); track project.id) {
              <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-700">
                <div class="p-6">
                  <div class="flex items-start justify-between mb-4">
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                      {{ project.title }}
                    </h3>
                    <span 
                      class="px-2 py-1 text-xs font-semibold rounded-full"
                      [style.background-color]="getStatusColor(project.status) + '20'"
                      [style.color]="getStatusColor(project.status)"
                    >
                      {{ project.status | projectStatus }}
                    </span>
                  </div>
                  
                  @if (project.description) {
                    <p class="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                      {{ project.description }}
                    </p>
                  }

                  <div class="space-y-3 mb-4">
                    @if (project.clientName) {
                      <div class="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                        </svg>
                        {{ project.clientName }}
                      </div>
                    }
                    <div class="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                      </svg>
                      {{ project.startDate | date:'dd/MM/yyyy' }}
                      @if (project.endDate) {
                        - {{ project.endDate | date:'dd/MM/yyyy' }}
                      }
                    </div>
                  </div>

                  <!-- Stats -->
                  <div class="mb-4">
                    <div class="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                      <span>📋 {{ project.boardCount }} board(s)</span>
                      <span class="text-xs">{{ project.status | projectStatus }}</span>
                    </div>
                  </div>

                  <div class="flex gap-2">
                    <button
                      (click)="editProject(project)"
                      class="flex-1 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium"
                    >
                      Editar
                    </button>
                    <button
                      (click)="deleteProject(project.id)"
                      class="px-3 py-2 border border-red-300 dark:border-red-600 text-red-600 dark:text-red-400 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 text-sm font-medium"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            } @empty {
              <div class="col-span-full text-center py-12 text-gray-500 dark:text-gray-400">
                No se encontraron proyectos
              </div>
            }
          </div>
        }
      }
    </div>
  `
})
export class ProjectsViewComponent {
    private projectsService = inject(ProjectsService);
    private toastr = inject(ToastrService);

    projects = signal<Project[]>([]);
    loading = signal(false);
    searchQuery = '';
    statusFilter: ProjectStatus | '' = '';
    viewMode = signal<'table' | 'cards'>('cards');

    filteredProjects = computed(() => {
        let result = this.projects();

        if (this.searchQuery) {
            const query = this.searchQuery.toLowerCase();
            result = result.filter(p =>
                p.title.toLowerCase().includes(query) ||
                p.description?.toLowerCase().includes(query) ||
                p.clientName?.toLowerCase().includes(query)
            );
        }

        if (this.statusFilter) {
            result = result.filter(p => p.status === this.statusFilter);
        }

        return result;
    });

    constructor() {
        this.loadProjects();
    }

    loadProjects() {
        this.loading.set(true);
        this.projectsService.getProjects(1, 100).subscribe({
            next: (response) => {
                if (response.success && response.data) {
                    this.projects.set(response.data.items);
                }
                this.loading.set(false);
            },
            error: () => {
                this.toastr.error('Error al cargar proyectos');
                this.loading.set(false);
            }
        });
    }

    onSearch() {
        // Computed se actualiza automáticamente
    }

    onFilterChange() {
        // Computed se actualiza automáticamente
    }

    toggleView() {
        this.viewMode.update(mode => mode === 'table' ? 'cards' : 'table');
    }

    getStatusColor(status: ProjectStatus): string {
        return PROJECT_STATUS_COLORS[status];
    }

    createProject() {
        this.toastr.info('Crear nuevo proyecto');
        // TODO: Implementar modal de creación
    }

    editProject(project: Project) {
        this.toastr.info(`Editar proyecto: ${project.title}`);
        // TODO: Implementar modal de edición
    }

    deleteProject(id: string) {
        if (!confirm('¿Estás seguro de eliminar este proyecto?')) return;

        this.projectsService.deleteProject(id).subscribe({
            next: () => {
                this.projects.update(projects => projects.filter(p => p.id !== id));
                this.toastr.success('Proyecto eliminado');
            },
            error: () => {
                this.toastr.error('Error al eliminar proyecto');
            }
        });
    }
}
