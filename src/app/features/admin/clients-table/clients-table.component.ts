import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

import { ClientsService } from '@data-access/clients.service';
import { Client } from '@models/client.models';

@Component({
    selector: 'app-clients-table',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Clientes</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Total: {{ filteredClients().length }} clientes
          </p>
        </div>
        <div class="flex gap-3">
          <input
            type="search"
            [(ngModel)]="searchQuery"
            (ngModelChange)="onSearch()"
            placeholder="Buscar clientes..."
            class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm"
          />
          <button
            (click)="createClient()"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center gap-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
            </svg>
            Nuevo Cliente
          </button>
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
                    Cliente
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Email
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Teléfono
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Proyectos
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
                @for (client of paginatedClients(); track client.id) {
                  <tr class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center">
                        <div class="h-10 w-10 rounded-full bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center text-white font-semibold">
                          {{ client.name.charAt(0) }}
                        </div>
                        <div class="ml-4">
                          <div class="text-sm font-medium text-gray-900 dark:text-white">
                            {{ client.name }}
                          </div>
                          @if (client.company) {
                            <div class="text-xs text-gray-500 dark:text-gray-400">
                              {{ client.company }}
                            </div>
                          }
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm text-gray-900 dark:text-gray-300">{{ client.email }}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm text-gray-900 dark:text-gray-300">
                        {{ client.phone || '-' }}
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        {{ client.projectCount || 0 }} proyecto(s)
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {{ client.createdAt | date:'dd/MM/yyyy' }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        (click)="editClient(client)"
                        class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-4"
                      >
                        Editar
                      </button>
                      <button
                        (click)="deleteClient(client.id)"
                        class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                } @empty {
                  <tr>
                    <td colspan="6" class="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                      No se encontraron clientes
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>

          <!-- Pagination -->
          <div class="bg-white dark:bg-gray-800 px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 sm:px-6">
            <div class="flex-1 flex justify-between items-center">
              <div>
                <p class="text-sm text-gray-700 dark:text-gray-300">
                  Mostrando
                  <span class="font-medium">{{ (currentPage() - 1) * pageSize() + 1 }}</span>
                  a
                  <span class="font-medium">{{ Math.min(currentPage() * pageSize(), filteredClients().length) }}</span>
                  de
                  <span class="font-medium">{{ filteredClients().length }}</span>
                  resultados
                </p>
              </div>
              <div class="flex gap-2">
                <button
                  (click)="prevPage()"
                  [disabled]="currentPage() === 1"
                  class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
                >
                  Anterior
                </button>
                <button
                  (click)="nextPage()"
                  [disabled]="currentPage() >= totalPages()"
                  class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
                >
                  Siguiente
                </button>
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  `
})
export class ClientsTableComponent {
    private clientsService = inject(ClientsService);
    private toastr = inject(ToastrService);

    readonly Math = Math;

    clients = signal<Client[]>([]);
    loading = signal(false);
    searchQuery = '';
    currentPage = signal(1);
    pageSize = signal(10);

    filteredClients = computed(() => {
        let result = this.clients();

        if (this.searchQuery) {
            const query = this.searchQuery.toLowerCase();
            result = result.filter(c =>
                c.name.toLowerCase().includes(query) ||
                c.email.toLowerCase().includes(query) ||
                c.company?.toLowerCase().includes(query)
            );
        }

        return result;
    });

    totalPages = computed(() => Math.ceil(this.filteredClients().length / this.pageSize()));

    paginatedClients = computed(() => {
        const start = (this.currentPage() - 1) * this.pageSize();
        const end = start + this.pageSize();
        return this.filteredClients().slice(start, end);
    });

    constructor() {
        this.loadClients();
    }

    loadClients() {
        this.loading.set(true);
        this.clientsService.getClients(1, 100).subscribe({
            next: (response) => {
                if (response.success && response.data) {
                    this.clients.set(response.data.items);
                }
                this.loading.set(false);
            },
            error: () => {
                this.toastr.error('Error al cargar clientes');
                this.loading.set(false);
            }
        });
    }

    onSearch() {
        this.currentPage.set(1);
    }

    createClient() {
        this.toastr.info('Crear nuevo cliente');
        // TODO: Implementar modal de creación
    }

    editClient(client: Client) {
        this.toastr.info(`Editar cliente: ${client.name}`);
        // TODO: Implementar modal de edición
    }

    deleteClient(id: string) {
        if (!confirm('¿Estás seguro de eliminar este cliente?')) return;

        this.clientsService.deleteClient(id).subscribe({
            next: () => {
                this.clients.update(clients => clients.filter(c => c.id !== id));
                this.toastr.success('Cliente eliminado');
            },
            error: () => {
                this.toastr.error('Error al eliminar cliente');
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
}
