import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

import { TagsService } from '@data-access/tags.service';
import { Tag } from '@models/tag.models';

@Component({
    selector: 'app-tags-admin',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Etiquetas</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Total: {{ tags().length }} etiquetas
          </p>
        </div>
        <button
          (click)="showCreateForm = true"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center gap-2"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
          </svg>
          Nueva Etiqueta
        </button>
      </div>

      <!-- Create Form -->
      @if (showCreateForm) {
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {{ editingTag() ? 'Editar Etiqueta' : 'Nueva Etiqueta' }}
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Nombre
              </label>
              <input
                type="text"
                [(ngModel)]="formData.name"
                placeholder="Ej: Frontend"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Color
              </label>
              <div class="flex gap-2">
                <input
                  type="color"
                  [(ngModel)]="formData.color"
                  class="h-10 w-20 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
                />
                <input
                  type="text"
                  [(ngModel)]="formData.color"
                  placeholder="#3B82F6"
                  class="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm"
                />
              </div>
            </div>
            <div class="flex items-end gap-2">
              <button
                (click)="saveTag()"
                [disabled]="!formData.name.trim() || loading()"
                class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm font-medium"
              >
                {{ editingTag() ? 'Actualizar' : 'Crear' }}
              </button>
              <button
                (click)="cancelEdit()"
                class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      }

      <!-- Tags Grid -->
      @if (loading()) {
        <div class="text-center py-8">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      } @else {
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          @for (tag of tags(); track tag.id) {
            <div 
              class="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-700 p-4"
            >
              <div class="flex items-center justify-between mb-3">
                <div class="flex items-center gap-3">
                  <div 
                    class="w-8 h-8 rounded-full"
                    [style.background-color]="tag.color"
                  ></div>
                  <span class="font-medium text-gray-900 dark:text-white">
                    {{ tag.name }}
                  </span>
                </div>
              </div>
              <div class="flex items-center justify-between text-sm">
                <span class="text-gray-500 dark:text-gray-400">
                  {{ tag.color }}
                </span>
                <div class="flex gap-2">
                  <button
                    (click)="editTag(tag)"
                    class="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                    </svg>
                  </button>
                  <button
                    (click)="deleteTag(tag.id)"
                    class="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          } @empty {
            <div class="col-span-full text-center py-12 text-gray-500 dark:text-gray-400">
              No hay etiquetas. ¡Crea la primera!
            </div>
          }
        </div>
      }
    </div>
  `
})
export class TagsAdminComponent {
    private tagsService = inject(TagsService);
    private toastr = inject(ToastrService);

    tags = signal<Tag[]>([]);
    loading = signal(false);
    showCreateForm = false;
    editingTag = signal<Tag | null>(null);

    formData = {
        name: '',
        color: '#3B82F6'
    };

    constructor() {
        this.loadTags();
    }

    loadTags() {
        this.loading.set(true);
        this.tagsService.getTags().subscribe({
            next: (response) => {
                if (response.success && response.data) {
                    this.tags.set(response.data);
                }
                this.loading.set(false);
            },
            error: () => {
                this.toastr.error('Error al cargar etiquetas');
                this.loading.set(false);
            }
        });
    }

    saveTag() {
        if (!this.formData.name.trim()) return;

        this.loading.set(true);
        const editing = this.editingTag();

        if (editing) {
            // Update not supported, delete and recreate
            this.toastr.info('La actualización de tags requiere eliminar y recrear');
            this.loading.set(false);
            return;
        }

        this.tagsService.createTag(this.formData.name.trim(), this.formData.color).subscribe({
            next: () => {
                this.toastr.success('Etiqueta creada');
                this.loadTags();
                this.cancelEdit();
                this.loading.set(false);
            },
            error: () => {
                this.toastr.error('Error al crear');
                this.loading.set(false);
            }
        });
    }

    editTag(tag: Tag) {
        this.editingTag.set(tag);
        this.formData = {
            name: tag.name,
            color: tag.color
        };
        this.showCreateForm = true;
    }

    deleteTag(id: string) {
        if (!confirm('¿Eliminar esta etiqueta?')) return;

        this.tagsService.deleteTag(id).subscribe({
            next: () => {
                this.tags.update(tags => tags.filter(t => t.id !== id));
                this.toastr.success('Etiqueta eliminada');
            },
            error: () => {
                this.toastr.error('Error al eliminar');
            }
        });
    }

    cancelEdit() {
        this.showCreateForm = false;
        this.editingTag.set(null);
        this.formData = {
            name: '',
            color: '#3B82F6'
        };
    }
}
