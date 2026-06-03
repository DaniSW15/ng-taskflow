import { Component, inject, signal, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

import { TagsService } from '@data-access/tags.service';
import { Tag } from '@models/tag.models';

@Component({
    selector: 'app-tag-selector',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="space-y-3">
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Etiquetas
      </label>

      <!-- Selected Tags -->
      <div class="flex flex-wrap gap-2">
        @for (tag of selectedTags(); track tag.id) {
          <span 
            class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium cursor-pointer hover:opacity-80"
            [style.background-color]="tag.color + '20'"
            [style.color]="tag.color"
            (click)="removeTag(tag)"
          >
            {{ tag.name }}
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </span>
        } @empty {
          <span class="text-sm text-gray-400 italic">Sin etiquetas</span>
        }
      </div>

      <!-- Tag Selector -->
      <div class="relative">
        <input
          type="text"
          [(ngModel)]="searchQuery"
          (focus)="showDropdown = true"
          (blur)="onBlur()"
          placeholder="Buscar o agregar etiquetas..."
          class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm"
        />

        @if (showDropdown && availableTags().length > 0) {
          <div class="absolute z-10 mt-1 w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-auto">
            @for (tag of filteredTags(); track tag.id) {
              <button
                type="button"
                (mousedown)="addTag(tag)"
                class="w-full px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors flex items-center gap-2"
              >
                <span 
                  class="w-3 h-3 rounded-full"
                  [style.background-color]="tag.color"
                ></span>
                <span class="text-sm text-gray-900 dark:text-white">{{ tag.name }}</span>
              </button>
            } @empty {
              <div class="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                No se encontraron etiquetas
              </div>
            }
          </div>
        }
      </div>
    </div>
  `
})
export class TagSelectorComponent {
    private tagsService = inject(TagsService);
    private toastr = inject(ToastrService);

    selectedTags = input<Tag[]>([]);
    tagsChanged = output<Tag[]>();

    allTags = signal<Tag[]>([]);
    searchQuery = '';
    showDropdown = false;

    availableTags = signal<Tag[]>([]);

    constructor() {
        this.loadTags();
    }

    loadTags() {
        this.tagsService.getTags().subscribe({
            next: (response) => {
                if (response.success && response.data) {
                    this.allTags.set(response.data);
                    this.updateAvailableTags();
                }
            },
            error: () => {
                this.toastr.error('Error al cargar etiquetas');
            }
        });
    }

    filteredTags(): Tag[] {
        const available = this.availableTags();
        if (!this.searchQuery) return available;

        const query = this.searchQuery.toLowerCase();
        return available.filter(tag => tag.name.toLowerCase().includes(query));
    }

    addTag(tag: Tag) {
        const updated = [...this.selectedTags(), tag];
        this.tagsChanged.emit(updated);
        this.searchQuery = '';
        this.showDropdown = false;
        this.updateAvailableTags();
    }

    removeTag(tag: Tag) {
        const updated = this.selectedTags().filter(t => t.id !== tag.id);
        this.tagsChanged.emit(updated);
        this.updateAvailableTags();
    }

    updateAvailableTags() {
        const selectedIds = new Set(this.selectedTags().map(t => t.id));
        this.availableTags.set(this.allTags().filter(t => !selectedIds.has(t.id)));
    }

    onBlur() {
        setTimeout(() => {
            this.showDropdown = false;
        }, 200);
    }
}
