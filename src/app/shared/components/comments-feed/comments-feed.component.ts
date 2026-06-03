import { Component, inject, signal, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

import { TasksService } from '@data-access/tasks.service';
import { Comment } from '@models/comment.models';

@Component({
    selector: 'app-comments-feed',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="space-y-4">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Comentarios</h3>

      <!-- Add Comment -->
      <div class="flex gap-3">
        <input
          type="text"
          [(ngModel)]="newComment"
          (keyup.enter)="addComment()"
          placeholder="Escribe un comentario..."
          class="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm"
        />
        <button
          (click)="addComment()"
          [disabled]="!newComment.trim() || loading()"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm font-medium"
        >
          Enviar
        </button>
      </div>

      <!-- Comments List -->
      <div class="space-y-3 max-h-96 overflow-y-auto">
        @if (loadingComments()) {
          <div class="text-center py-4">
            <div class="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          </div>
        } @else {
          @for (comment of comments(); track comment.id) {
            <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div class="flex items-start gap-3">
                <div class="h-8 w-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white text-sm font-semibold shrink-0">
                  {{ getInitials(comment.authorFullName) }}
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center justify-between gap-2 mb-1">
                    <span class="text-sm font-medium text-gray-900 dark:text-white">
                      {{ comment.authorFullName }}
                    </span>
                    <div class="flex items-center gap-2">
                      <span class="text-xs text-gray-500 dark:text-gray-400">
                        {{ getRelativeTime(comment.createdAt) }}
                      </span>
                      <button
                        (click)="deleteComment(comment.id)"
                        class="text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                  <p class="text-sm text-gray-700 dark:text-gray-300">
                    {{ comment.content }}
                  </p>
                </div>
              </div>
            </div>
          } @empty {
            <div class="text-center py-8 text-gray-500 dark:text-gray-400 text-sm">
              No hay comentarios aún. ¡Sé el primero en comentar!
            </div>
          }
        }
      </div>
    </div>
  `
})
export class CommentsFeedComponent {
    private tasksService = inject(TasksService);
    private toastr = inject(ToastrService);

    taskId = input.required<string>();

    comments = signal<Comment[]>([]);
    loadingComments = signal(false);
    loading = signal(false);
    newComment = '';

    constructor() {
        this.loadComments();
    }

    loadComments() {
        this.loadingComments.set(true);
        this.tasksService.getComments(this.taskId(), 1, 50).subscribe({
            next: (response) => {
                if (response.success && response.data) {
                    this.comments.set(response.data.items);
                }
                this.loadingComments.set(false);
            },
            error: () => {
                this.toastr.error('Error al cargar comentarios');
                this.loadingComments.set(false);
            }
        });
    }

    addComment() {
        if (!this.newComment.trim()) return;

        this.loading.set(true);
        this.tasksService.addComment(this.taskId(), this.newComment).subscribe({
            next: () => {
                this.newComment = '';
                this.loadComments();
                this.loading.set(false);
                this.toastr.success('Comentario agregado');
            },
            error: () => {
                this.toastr.error('Error al agregar comentario');
                this.loading.set(false);
            }
        });
    }

    deleteComment(commentId: string) {
        if (!confirm('¿Eliminar este comentario?')) return;

        this.tasksService.deleteComment(this.taskId(), commentId).subscribe({
            next: () => {
                this.comments.update(comments => comments.filter(c => c.id !== commentId));
                this.toastr.success('Comentario eliminado');
            },
            error: () => {
                this.toastr.error('Error al eliminar comentario');
            }
        });
    }

    getInitials(name: string): string {
        return name.split(' ').map(n => n.charAt(0)).join('').substring(0, 2).toUpperCase();
    }

    getRelativeTime(date: string): string {
        const now = new Date();
        const commentDate = new Date(date);
        const diffMs = now.getTime() - commentDate.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Ahora';
        if (diffMins < 60) return `Hace ${diffMins}m`;
        if (diffHours < 24) return `Hace ${diffHours}h`;
        if (diffDays < 7) return `Hace ${diffDays}d`;
        return commentDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
    }
}
