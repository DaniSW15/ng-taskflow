import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '@core/auth/auth.service';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CommonModule, RouterLink],
    template: `
    <div class="space-y-8">

      <!-- Welcome header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
            Hola, {{ auth.user()?.firstName ?? 'Usuario' }} 👋
          </h1>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Aquí tienes un resumen de tu espacio de trabajo.
          </p>
        </div>
        <a
          routerLink="/boards"
          class="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl transition"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h8" />
          </svg>
          Ver tableros
        </a>
      </div>

      <!-- Stats grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

        <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
          <div class="flex items-center justify-between mb-4">
            <div class="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/40 rounded-xl flex items-center justify-center">
              <svg class="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
              </svg>
            </div>
            <span class="text-xs font-medium text-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-1 rounded-lg">Activos</span>
          </div>
          <p class="text-2xl font-bold text-gray-900 dark:text-white">—</p>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Tableros</p>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
          <div class="flex items-center justify-between mb-4">
            <div class="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/40 rounded-xl flex items-center justify-center">
              <svg class="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <span class="text-xs font-medium text-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-1 rounded-lg">Total</span>
          </div>
          <p class="text-2xl font-bold text-gray-900 dark:text-white">—</p>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Tareas</p>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
          <div class="flex items-center justify-between mb-4">
            <div class="w-10 h-10 bg-amber-100 dark:bg-amber-900/40 rounded-xl flex items-center justify-center">
              <svg class="w-5 h-5 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span class="text-xs font-medium text-amber-500 bg-amber-50 dark:bg-amber-900/30 px-2 py-1 rounded-lg">Pendiente</span>
          </div>
          <p class="text-2xl font-bold text-gray-900 dark:text-white">—</p>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">En progreso</p>
        </div>

      </div>

      <!-- Quick actions -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6">
        <h2 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Acciones rápidas</h2>
        <div class="flex flex-wrap gap-3">
          <a
            routerLink="/boards"
            class="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 border border-gray-200 dark:border-gray-600 text-sm text-gray-700 dark:text-gray-300 hover:text-indigo-700 dark:hover:text-indigo-300 transition"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
            </svg>
            Ir a tableros
          </a>
          @if (auth.isAdmin()) {
            <a
              routerLink="/admin"
              class="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-700 hover:bg-rose-50 dark:hover:bg-rose-900/30 border border-gray-200 dark:border-gray-600 text-sm text-gray-700 dark:text-gray-300 hover:text-rose-700 dark:hover:text-rose-300 transition"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              Panel de administración
            </a>
          }
        </div>
      </div>

      <!-- User info card -->
      <div class="bg-linear-to-br from-indigo-600 to-blue-600 rounded-2xl p-6 text-white">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-xl font-bold">
            {{ (auth.user()?.firstName ?? 'U')[0] | uppercase }}
          </div>
          <div>
            <p class="font-semibold">{{ auth.user()?.firstName }} {{ auth.user()?.lastName }}</p>
            <p class="text-sm text-blue-100">{{ auth.user()?.email }}</p>
          </div>
        </div>
      </div>

    </div>
  `
})
export class DashboardComponent {
    readonly auth = inject(AuthService);
}

