import { ChangeDetectionStrategy, Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersService } from '@data-access/users.service';
import { User } from '@models/user.models';
import { UserRole } from '@models/auth.models';
import { PaginatedList } from '@models/board.models';
import { RoleBadgeComponent } from '@shared/components/role-badge/role-badge.component';

@Component({
    selector: 'app-admin',
    standalone: true,
    imports: [CommonModule, RoleBadgeComponent],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
    <div class="px-4 sm:px-0">
      <div class="mb-6">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Panel de administración</h2>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Gestión de usuarios y roles</p>
      </div>

      @if (loading()) {
        <div class="space-y-3">
          @for (_ of skeletons; track $index) {
            <div class="h-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          }
        </div>
      } @else {
        <div class="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Nombre</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Email</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Rol actual</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Cambiar rol</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              @for (user of paginated()?.items; track user.id) {
                <tr class="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <td class="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white whitespace-nowrap">
                    {{ user.fullName }}
                  </td>
                  <td class="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
                    {{ user.email }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <app-role-badge [role]="user.role" />
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <select
                      (change)="onRoleChange(user, $event)"
                      [disabled]="saving() === user.id"
                      class="text-sm border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                      @for (opt of roleOptions; track opt.value) {
                        <option [value]="opt.value" [selected]="opt.value === user.role">{{ opt.label }}</option>
                      }
                    </select>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center gap-3">
                      @if (saving() === user.id) {
                        <span class="text-xs text-gray-400">Guardando...</span>
                      } @else if (feedback() === user.id) {
                        <span class="text-xs text-emerald-600 dark:text-emerald-400 font-medium">✓ Guardado</span>
                      }
                      <button
                        (click)="deleteUser(user.id)"
                        [disabled]="saving() === user.id"
                        class="text-xs text-red-500 hover:text-red-700 disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="5" class="px-6 py-12 text-center text-sm text-gray-400">No hay usuarios.</td>
                </tr>
              }
            </tbody>
          </table>
        </div>

        @if (paginated(); as p) {
          @if (p.totalPages > 1) {
            <div class="mt-6 flex items-center justify-center gap-4">
              <button (click)="prevPage()" [disabled]="!p.hasPreviousPage" class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed">
                Anterior
              </button>
              <span class="text-sm text-gray-600 dark:text-gray-400">{{ currentPage() }} / {{ p.totalPages }}</span>
              <button (click)="nextPage()" [disabled]="!p.hasNextPage" class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed">
                Siguiente
              </button>
            </div>
          }
        }
      }
    </div>
  `
})
export class AdminComponent implements OnInit {
    private readonly usersService = inject(UsersService);

    readonly skeletons = Array(8);
    readonly loading = signal(true);
    readonly saving = signal<string | null>(null);
    readonly feedback = signal<string | null>(null);
    readonly paginated = signal<PaginatedList<User> | null>(null);
    readonly currentPage = signal(1);

    readonly roleOptions = [
        { value: UserRole.Member,  label: 'Member'  },
        { value: UserRole.Admin,   label: 'Admin'   },
        { value: UserRole.Analyst, label: 'Analyst' },
        { value: UserRole.Client,  label: 'Client'  },
    ];

    ngOnInit() { this.load(); }

    load() {
        this.loading.set(true);
        this.usersService.getUsers(this.currentPage(), 20).subscribe({
            next: res => { this.paginated.set(res.data); this.loading.set(false); },
            error: () => this.loading.set(false)
        });
    }

    onRoleChange(user: User, event: Event) {
        const newRole = Number((event.target as HTMLSelectElement).value) as UserRole;
        if (newRole === user.role) return;

        this.saving.set(user.id);
        this.feedback.set(null);

        this.usersService.changeRole(user.id, newRole).subscribe({
            next: () => {
                const p = this.paginated();
                if (p) {
                    this.paginated.set({
                        ...p,
                        items: p.items.map(u => u.id === user.id ? { ...u, role: newRole } : u)
                    });
                }
                this.saving.set(null);
                this.feedback.set(user.id);
                setTimeout(() => this.feedback.set(null), 2000);
            },
            error: () => this.saving.set(null)
        });
    }

    deleteUser(id: string) {
        if (!confirm('¿Eliminar este usuario? Esta acción no se puede deshacer.')) return;
        this.usersService.deleteUser(id).subscribe({ next: () => this.load() });
    }

    nextPage() { this.currentPage.update(p => p + 1); this.load(); }
    prevPage() { this.currentPage.update(p => p - 1); this.load(); }
}
