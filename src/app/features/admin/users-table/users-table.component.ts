import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

import { UsersService } from '@data-access/users.service';
import { User } from '@models/user.models';
import { UserRole } from '@models/auth.models';
import { UserRolePipe } from '@shared/pipes/user-role.pipe';
import { USER_ROLE_LABELS } from '@shared/utils/constants';

@Component({
    selector: 'app-users-table',
    standalone: true,
    imports: [CommonModule, FormsModule, UserRolePipe],
    template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Usuarios</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Total: {{ filteredUsers().length }} usuarios
          </p>
        </div>
        <div class="flex gap-3">
          <input
            type="search"
            [(ngModel)]="searchQuery"
            (ngModelChange)="onSearch()"
            placeholder="Buscar usuarios..."
            class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm"
          />
          <select
            [(ngModel)]="roleFilter"
            (ngModelChange)="onFilterChange()"
            class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm"
          >
            <option value="">Todos los roles</option>
            <option value="Member">Member</option>
            <option value="Admin">Admin</option>
            <option value="Analyst">Analyst</option>
            <option value="Client">Client</option>
          </select>
        </div>
      </div>

      <!-- Table -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        @if (loading()) {
          <div class="p-8 text-center">
            <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        } @else {
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead class="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Usuario
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Email
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Rol
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Estado
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Creado
                  </th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                @for (user of paginatedUsers(); track user.id) {
                  <tr class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center">
                        <div class="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                          {{ user.firstName.charAt(0) }}{{ user.lastName.charAt(0) }}
                        </div>
                        <div class="ml-4">
                          <div class="text-sm font-medium text-gray-900 dark:text-white">
                            {{ user.firstName }} {{ user.lastName }}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm text-gray-900 dark:text-gray-300">{{ user.email }}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span 
                        class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
                        [class]="getRoleClass(user.role)"
                      >
                        {{ user.role | userRole }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        Activo
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {{ user.createdAt | date:'dd/MM/yyyy' }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        (click)="editUser(user)"
                        class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-4"
                      >
                        Editar
                      </button>
                      <button
                        (click)="deleteUser(user.id)"
                        class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                } @empty {
                  <tr>
                    <td colspan="6" class="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                      No se encontraron usuarios
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>

          <!-- Pagination -->
          <div class="bg-white dark:bg-gray-800 px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 sm:px-6">
            <div class="flex-1 flex justify-between sm:hidden">
              <button
                (click)="prevPage()"
                [disabled]="currentPage() === 1"
                class="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
              >
                Anterior
              </button>
              <button
                (click)="nextPage()"
                [disabled]="currentPage() >= totalPages()"
                class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
              >
                Siguiente
              </button>
            </div>
            <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p class="text-sm text-gray-700 dark:text-gray-300">
                  Mostrando
                  <span class="font-medium">{{ (currentPage() - 1) * pageSize() + 1 }}</span>
                  a
                  <span class="font-medium">{{ Math.min(currentPage() * pageSize(), filteredUsers().length) }}</span>
                  de
                  <span class="font-medium">{{ filteredUsers().length }}</span>
                  resultados
                </p>
              </div>
              <div>
                <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    (click)="prevPage()"
                    [disabled]="currentPage() === 1"
                    class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
                  >
                    <span class="sr-only">Anterior</span>
                    ←
                  </button>
                  @for (page of pages(); track page) {
                    <button
                      (click)="goToPage(page)"
                      [class]="page === currentPage() ? 'z-10 bg-blue-50 dark:bg-blue-900 border-blue-500 text-blue-600 dark:text-blue-300' : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'"
                      class="relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                    >
                      {{ page }}
                    </button>
                  }
                  <button
                    (click)="nextPage()"
                    [disabled]="currentPage() >= totalPages()"
                    class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
                  >
                    <span class="sr-only">Siguiente</span>
                    →
                  </button>
                </nav>
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  `
})
export class UsersTableComponent {
    private usersService = inject(UsersService);
    private toastr = inject(ToastrService);

    readonly Math = Math;

    users = signal<User[]>([]);
    loading = signal(false);
    searchQuery = '';
    roleFilter: UserRole | '' = '';
    currentPage = signal(1);
    pageSize = signal(10);

    filteredUsers = computed(() => {
        let result = this.users();

        if (this.searchQuery) {
            const query = this.searchQuery.toLowerCase();
            result = result.filter(u =>
                u.firstName.toLowerCase().includes(query) ||
                u.lastName.toLowerCase().includes(query) ||
                u.email.toLowerCase().includes(query)
            );
        }

        if (this.roleFilter) {
            result = result.filter(u => u.role === this.roleFilter);
        }

        return result;
    });

    totalPages = computed(() => Math.ceil(this.filteredUsers().length / this.pageSize()));

    paginatedUsers = computed(() => {
        const start = (this.currentPage() - 1) * this.pageSize();
        const end = start + this.pageSize();
        return this.filteredUsers().slice(start, end);
    });

    pages = computed(() => {
        const total = this.totalPages();
        const current = this.currentPage();
        const delta = 2;
        const range: number[] = [];
        const rangeWithDots: (number | string)[] = [];

        for (let i = Math.max(2, current - delta); i <= Math.min(total - 1, current + delta); i++) {
            range.push(i);
        }

        if (current - delta > 2) {
            rangeWithDots.push(1, '...');
        } else {
            rangeWithDots.push(1);
        }

        rangeWithDots.push(...range);

        if (current + delta < total - 1) {
            rangeWithDots.push('...', total);
        } else if (total > 1) {
            rangeWithDots.push(total);
        }

        return rangeWithDots.filter(p => typeof p === 'number') as number[];
    });

    constructor() {
        this.loadUsers();
    }

    loadUsers() {
        this.loading.set(true);
        this.usersService.getUsers(1, 100).subscribe({
            next: (response) => {
                if (response.success && response.data) {
                    this.users.set(response.data.items);
                }
                this.loading.set(false);
            },
            error: () => {
                this.toastr.error('Error al cargar usuarios');
                this.loading.set(false);
            }
        });
    }

    onSearch() {
        this.currentPage.set(1);
    }

    onFilterChange() {
        this.currentPage.set(1);
    }

    getRoleClass(role: UserRole): string {
        const map: Record<UserRole, string> = {
            [UserRole.Member]: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
            [UserRole.Admin]: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
            [UserRole.Analyst]: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
            [UserRole.Client]: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
        };
        return map[role] ?? '';
    }

    editUser(user: User) {
        this.toastr.info(`Editar usuario: ${user.firstName} ${user.lastName}`);
        // TODO: Implementar modal de edición
    }

    deleteUser(id: string) {
        if (!confirm('¿Estás seguro de eliminar este usuario?')) return;

        this.usersService.deleteUser(id).subscribe({
            next: () => {
                this.users.update(users => users.filter(u => u.id !== id));
                this.toastr.success('Usuario eliminado');
            },
            error: () => {
                this.toastr.error('Error al eliminar usuario');
            }
        });
    }

    prevPage() {
        if (this.currentPage() > 1) {
            this.currentPage.update(p => p - 1);
        }
    }

    nextPage() {
        if (this.currentPage() < this.totalPages()) {
            this.currentPage.update(p => p + 1);
        }
    }

    goToPage(page: number) {
        this.currentPage.set(page);
    }
}
